/* eslint-disable */
import * as tf from '@tensorflow/tfjs';
import getDatasetById from './datasets';

import {
    boxCoxInvTransform,
    boxCoxTransform,
    formatDataset,
    getSingleModel,
    getStd,
    trainTestSplit,
    zIndexTransform,
} from './utils';

const state = {
    READY: 0,
    TRAINING: 1,
    PAUSED: 2,
};

let datasetParameters;
let modelHyperparameters;
let inputFormat;
let currentState;
let trainMetadata;
let model;
let data;
let callbacks;
let epochsLeft;

const setup = (hyperparameters) => {
    datasetParameters = hyperparameters.datasetParameters;
    modelHyperparameters = hyperparameters.modelHyperparameters;
    inputFormat = hyperparameters.inputFormat;

    trainMetadata = getDatasetById(datasetParameters.dataset);
    _prepareDataSet();
    currentState = state.READY;
};

const play = async () => {
    switch (currentState) {
        case state.READY:
            postMessage({type: 'action', name: 'resetLoss'});
            await _train();
            postMessage({type: 'mutation', name: 'updateTraining', payload: true});
            postMessage({type: 'mutation', name: 'updatePaused', payload: false});
            break;
        case state.PAUSED:
            await _train();
            postMessage({type: 'mutation', name: 'updateTraining', payload: true});
            postMessage({type: 'mutation', name: 'updatePaused', payload: false});
            break;

        case state.TRAINING:
            postMessage({type: 'mutation', name: 'updatePaused', payload: true});
            _pauseTraining();
            break;
    }
};

const changeDataSetId = (id) => {
    reset();
    datasetParameters.dataset = id;

    // free up memory before reading a new dataset
    tf.dispose([data.xTrain, data.yTrain, data.xTest, data.yTest]);

    // retrieve the selected dataset
    trainMetadata = getDatasetById(datasetParameters.dataset);

    _prepareDataSet();
};
const changeDataSplit = (split) => {
    reset();
    datasetParameters.split = split;
    _prepareDataSet();
};
const changeInputFormat = (newInputFormat) => {
    Object.assign(inputFormat, newInputFormat);
    reset();
    _prepareDataSet();
};
const changeHyperparameters = (newHyperparameters) => {
    Object.assign(modelHyperparameters, newHyperparameters);
};

const reset = () => {
    if (model) {
        model.stopTraining = true;
    }
    currentState = state.READY;
};

const _createNeuralNet = () => {
    // create the neural net model
    const inputShape = [inputFormat.autoregressiveLags + inputFormat.seasonLags];

    // dispose old model before creating a new one
    if (model) {
        tf.dispose(model);
    }

    model = getSingleModel(inputShape, modelHyperparameters.neurons,
        modelHyperparameters.activation, modelHyperparameters.learningRate);
};

const _prepareDataSet = () => {
    data = _getTrainTestDataset();

    callbacks = [{
        onTrainBegin: onTrainBegin.bind(this),
        onEpochEnd: onEpochEnd.bind(this),
    }];
};

const onTrainBegin = () => {
    // console.log("onTrainBegin")
    if (currentState !== state.PAUSED) {
        postMessage({type: 'action', name: 'resetMetrics'});
        postMessage({type: 'action', name: 'resetPredictions'});
    }
    currentState = state.TRAINING;
};

const onEpochEnd = (epoch, logs) => {
    // called at the end of every epoch.
    epochsLeft--;
    if (currentState === state.TRAINING) {
        postMessage({type: 'mutation', name: 'updateEpochsLeft', payload: epochsLeft});
    }
    tf.tidy(() => {
        logs.rmse = Math.sqrt(logs.mse);

        const inSamplePredictions = model.predict(data.xTrain);
        const residuals = tf.sub(inSamplePredictions.squeeze(), data.yTrain);

        const result = model.evaluate(data.xTest, data.yTest, {
            batch_size: 64,
        });

        Promise
            .all([result[0].data(), result[1].data(), result[2].data(), result[3].data(), result[4].data(), residuals.data()])
            .then((data) => {
                if (currentState === state.TRAINING) {
                    const testMetrics = {
                        mse: data[1][0],
                        mae: data[2][0],
                        mape: data[3][0],
                        me: data[4][0],
                        rmse: Math.sqrt(data[1][0]),
                    };
                    postMessage({
                        type: 'action',
                        name: 'onEpochEnd',
                        payload: {
                            metrics: logs,
                            metricsLoss: logs.loss,
                            testMetrics,
                            testMetricsLoss: data[0][0],
                            residuals: data[5],
                        },
                    });
                }
            })
            .catch((err) => {
                console.log(`error${err}`);
            });
    });
};

const _pauseTraining = () => {
    if (currentState === state.TRAINING) {
        console.log('Model is training. We can pause it.');
        model.stopTraining = true;
        currentState = state.PAUSED;
    }
};

const _train = async () => {
    if (currentState === state.READY) {
        currentState = state.TRAINING;
        // update the epochs left variable
        _createNeuralNet();
        epochsLeft = modelHyperparameters.epochs;
        postMessage({type: 'mutation', name: 'updateEpochsLeft', payload: epochsLeft});
    }

    model.fit(data.xTrain, data.yTrain, {
        epochs: epochsLeft,
        batchSize: modelHyperparameters.batchSize,
        validationData: [data.xTest, data.yTest],
        callbacks,
        shuffle: true,
    }).then(async () => {
        if (currentState !== state.READY) { // do not perform forecast if the service was reset
            await _forecast();
        }
        if (currentState === state.READY || currentState === state.TRAINING) {
            currentState = state.READY;
            postMessage({type: 'mutation', name: 'updateTraining', payload: false});
            console.log('****** End of experiement. ******');
        }
    });
};

const _getTrainTestDataset = () => {
    console.log('Reformatting dataset.');
    const {lambda_} = trainMetadata;
    const freq = trainMetadata.frequency;
    const minLength = Math.max(inputFormat.autoregressiveLags,
        inputFormat.seasonLags * freq) + 1;

    return tf.tidy(() => {
        let dataset = tf.tensor1d(trainMetadata.data);

        // boxcox transform the input data
        if (lambda_ !== null) {
            dataset = boxCoxTransform(dataset, lambda_);
        }

        // split the data into train/test
        const result = trainTestSplit(dataset, minLength, datasetParameters.split / 100);

        let {xTrain} = result;
        let {xTest} = result;

        // get z-index normal statistics
        const sampleMean = tf.mean(xTrain);
        const sampleStd = getStd(xTrain, sampleMean);

        // format the dataset to the correct format
        const formattedTrainData = formatDataset(xTrain, inputFormat.autoregressiveLags, inputFormat.seasonLags, freq);
        xTrain = formattedTrainData.X;
        xTrain = zIndexTransform(xTrain, sampleMean, sampleStd);
        const yTrain = formattedTrainData.y;

        // format the test data to the correct format
        const formattedTestData = formatDataset(xTest, inputFormat.autoregressiveLags, inputFormat.seasonLags, freq);
        xTest = formattedTestData.X;
        xTest = zIndexTransform(xTest, sampleMean, sampleStd);
        const yTest = formattedTestData.y;

        return {
            xTrain,
            yTrain,
            xTest,
            yTest,
        };
    });
};

const _forecast = async () => {
    tf.tidy(() => {
        const inSamplePredictions = model.predict(data.xTrain);
        const residuals = tf.sub(inSamplePredictions.squeeze(), data.yTrain);

        // compute the prediction intervals
        const residualMean = tf.mean(residuals);
        const residualStdDev = getStd(residuals, residualMean);

        let outOfSamplePredictions = model.predict(data.xTest);
        const predictionIntervals = _getPredictionIntervals(outOfSamplePredictions, residualMean, residualStdDev);

        let {lowerBound} = predictionIntervals;
        let {upperBound} = predictionIntervals;

        if (trainMetadata.lambda_ !== null) {
            outOfSamplePredictions = boxCoxInvTransform(outOfSamplePredictions, trainMetadata.lambda_);
            lowerBound = boxCoxInvTransform(predictionIntervals.lowerBound, trainMetadata.lambda_);
            upperBound = boxCoxInvTransform(predictionIntervals.upperBound, trainMetadata.lambda_);
        }

        Promise.resolve(residuals.data()).then((result) => {
            postMessage({type: 'mutation', name: 'updateResiduals', payload: result});
        });

        Promise.all([lowerBound.data(), upperBound.data(), outOfSamplePredictions.data()]).then((result) => {
            const predictionIntervals = {};
            let predictions;
            [predictionIntervals.upperBound, predictionIntervals.lowerBound, predictions] = result;
            postMessage({type: 'mutation', name: 'updatePredictionIntervals', payload: predictionIntervals});
            postMessage({type: 'mutation', name: 'updatePredictions', payload: predictions});
        });

        console.log('Tensorflow memory after training');
        console.log(tf.memory());
    });
};

const _getPredictionIntervals = (predictions, mean, stdDev) => tf.tidy(() => {
    const n = 500;
    const shape = [n, predictions.shape[0]];

    // sample values from a standard normal - ensure 95% confidence
    const errors = tf.truncatedNormal(shape, mean = mean.dataSync()[0], stdDev = stdDev.dataSync()[0]);

    const simulations = tf.add(tf.mul(predictions.squeeze(), tf.ones(shape)), errors);

    // calculate upper and lower prediction bounds
    const axis = 0;
    const upperBound = tf.max(simulations, axis);
    const lowerBound = tf.min(simulations, axis);
    const avgPrediction = tf.mean(simulations, axis);
    return {
        upperBound,
        lowerBound,
        avgPrediction,
    };
});

onmessage = async (e) => {
    switch (e.data.type) {
        case 'setup': {
            setup(e.data.payload);
            break;
        }
        case 'start': {
            await play();
            break;
        }
        case 'reset': {
            reset();
            break;
        }
        case 'updateDatasetId': {
            changeDataSetId(e.data.payload);
            break;
        }
        case 'updateDatasetSplit': {
            changeDataSplit(e.data.payload);
            break;
        }
        case 'updateModelHyperparameters': {
            changeHyperparameters(e.data.payload);
            break;
        }
        case 'updateinputFormat': {
            changeInputFormat(e.data.payload);
            break;
        }
        default:
            break;
    }
};
