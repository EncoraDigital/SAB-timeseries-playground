/* eslint-disable */
import getDatasetById from './datasets';

import {
    boxCoxInvTransform,
    boxCoxTransform,
    formatDataset,
    getSingleModel,
    getStd,
    me,
    trainTestSplit,
    zIndexTransform,
} from './utils';
import {
    add,
    dispose,
    max,
    mean,
    memory,
    min,
    mul,
    ones,
    sub,
    tensor1d,
    tidy,
    truncatedNormal
} from "@tensorflow/tfjs-core";
import '@tensorflow/tfjs-backend-webgl';

const state = {
    READY: 0,
    TRAINING: 1,
    PAUSED: 2,
};

let datasetParameters;
let modelHyperparameters;
let modelInputFormat;
let currentState;
let trainMetadata;
let model;
let data;
let callbacks;
let epochsLeft;

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
    epochsLeft -= 1;
    if (currentState === state.TRAINING) {
        postMessage({type: 'mutation', name: 'updateEpochsLeft', payload: epochsLeft});
    }
    tidy(() => {
        let inSamplePredictions
        logs.rmse = Math.sqrt(logs.mse);

        try {
            inSamplePredictions = model.predict(data.xTrain);
        } catch (e) {
            console.info(`Prediction failed or was stopped: ${e}`)
            return;
        }
        const residuals = sub(inSamplePredictions.squeeze(), data.yTrain);

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
                        [me.name]: data[4][0],
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
                console.info(`EpochEnd failed or has been stopped: ${err}`);
            });
    });
};
const getTrainTestDataset = () => {
    console.log('Reformatting dataset.');
    const {lambda_} = trainMetadata;
    const freq = trainMetadata.frequency;
    const minLength = Math.max(modelInputFormat.autoregressiveLags,
        modelInputFormat.seasonLags * freq) + 1;

    return tidy(() => {
        let dataset = tensor1d(trainMetadata.data);

        // boxcox transform the input data
        if (lambda_ !== null) {
            dataset = boxCoxTransform(dataset, lambda_);
        }

        // split the data into train/test
        const result = trainTestSplit(dataset, minLength, datasetParameters.split / 100);

        let {xTrain} = result;
        let {xTest} = result;

        // get z-index normal statistics
        const sampleMean = mean(xTrain);
        const sampleStd = getStd(xTrain, sampleMean);

        // format the dataset to the correct format
        const formattedTrainData = formatDataset(xTrain, modelInputFormat.autoregressiveLags, modelInputFormat.seasonLags, freq);
        xTrain = formattedTrainData.X;
        xTrain = zIndexTransform(xTrain, sampleMean, sampleStd);
        const yTrain = formattedTrainData.y;

        // format the test data to the correct format
        const formattedTestData = formatDataset(xTest, modelInputFormat.autoregressiveLags, modelInputFormat.seasonLags, freq);
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

const reset = () => {
    if (model) {
        model.stopTraining = true;
    }
    currentState = state.READY;
};

const prepareDataSet = () => {
    data = getTrainTestDataset();

    callbacks = [{
        onTrainBegin: onTrainBegin.bind(this),
        onEpochEnd: onEpochEnd.bind(this),
    }];
};

const setup = (parameters) => {
    postMessage({type: 'meUpdate', payload: me.name});
    datasetParameters = {...parameters.datasetParameters};
    modelHyperparameters = {...parameters.modelHyperparameters};
    modelInputFormat = {...parameters.inputFormat};
    trainMetadata = getDatasetById(datasetParameters.dataset);
    prepareDataSet();
    currentState = state.READY;
};

const changeDataSetId = (id) => {
    reset();
    datasetParameters.dataset = id;

    // free up memory before reading a new dataset
    dispose([data.xTrain, data.yTrain, data.xTest, data.yTest]);

    // retrieve the selected dataset
    trainMetadata = getDatasetById(datasetParameters.dataset);

    prepareDataSet();
};
const changeDataSplit = (split) => {
    reset();
    datasetParameters.split = split;
    prepareDataSet();
};
const changeInputFormat = (newInputFormat) => {
    reset();
    modelInputFormat = newInputFormat;
    // free up memory before reading a new dataset
    dispose([data.xTrain, data.yTrain, data.xTest, data.yTest]);
    prepareDataSet();
};
const changeHyperparameters = (newHyperparameters) => {
    reset();
    modelHyperparameters = newHyperparameters;
    prepareDataSet();
};

const createNeuralNet = (paramaters) => {
    // create the neural net model
    const inputShape = [modelInputFormat.autoregressiveLags + modelInputFormat.seasonLags];

    // dispose old model before creating a new one
    if (model) {
        dispose(model);
    }

    model = getSingleModel(inputShape, paramaters.neurons,
        paramaters.activation, paramaters.learningRate);
};

const pauseTraining = () => {
    if (currentState === state.TRAINING) {
        console.log('Model is training. We can pause it.');
        model.stopTraining = true;
        currentState = state.PAUSED;
    }
};

const train = async () => {
    let paramaters = {...modelHyperparameters};
    if (currentState === state.READY) {
        currentState = state.TRAINING;
        // update the epochs left variable
        createNeuralNet(paramaters);
        epochsLeft = paramaters.epochs;
        postMessage({type: 'mutation', name: 'updateEpochsLeft', payload: epochsLeft});
    }

    model.fit(data.xTrain, data.yTrain, {
        epochs: epochsLeft,
        batchSize: paramaters.batchSize,
        validationData: [data.xTest, data.yTest],
        callbacks,
        shuffle: true,
    }).then(async () => {
        if (currentState !== state.READY) { // do not perform forecast if the service was reset
            await forecast();
        }
        if (currentState === state.READY || currentState === state.TRAINING) {
            currentState = state.READY;
            postMessage({type: 'mutation', name: 'updateTraining', payload: false});
            console.log('****** End of experiement. ******');
        }
    }).catch((e) => {
        console.info(`model.fit has failed or has been stopped:${e}`)
    });

};

const forecast = async () => {
    tidy(() => {
        let outOfSamplePredictions;
        let inSamplePredictions;

        try {
            inSamplePredictions = model.predict(data.xTrain);
        } catch (e) {
            console.info(`Prediction failed or was stopped: ${e}`)
            return;
        }
        const residuals = sub(inSamplePredictions.squeeze(), data.yTrain);

        // compute the prediction intervals
        const residualMean = mean(residuals);
        const residualStdDev = getStd(residuals, residualMean);

        try {
            outOfSamplePredictions = model.predict(data.xTest);
        } catch (e) {
            console.info(`Prediction failed or was stopped: ${e}`)
            return;
        }
        const predictionIntervals = getPredictionIntervals(outOfSamplePredictions, residualMean, residualStdDev);

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
        console.log(memory());
    });
};

const getPredictionIntervals = (predictions, meanValue, stdDev) => tidy(() => {
    const n = 500;
    const shape = [n, predictions.shape[0]];

    // sample values from a standard normal - ensure 95% confidence
    const errors = truncatedNormal(shape, meanValue = meanValue.dataSync()[0], stdDev = stdDev.dataSync()[0]);

    const simulations = add(mul(predictions.squeeze(), ones(shape)), errors);

    // calculate upper and lower prediction bounds
    const axis = 0;
    const upperBound = max(simulations, axis);
    const lowerBound = min(simulations, axis);
    const avgPrediction = mean(simulations, axis);
    return {
        upperBound,
        lowerBound,
        avgPrediction,
    };
});
const play = async () => {
    switch (currentState) {
        case state.READY:
            postMessage({type: 'action', name: 'resetLoss'});
            await train();
            postMessage({type: 'mutation', name: 'updateTraining', payload: true});
            postMessage({type: 'mutation', name: 'updatePaused', payload: false});
            break;
        case state.PAUSED:
            await train();
            postMessage({type: 'mutation', name: 'updateTraining', payload: true});
            postMessage({type: 'mutation', name: 'updatePaused', payload: false});
            break;

        case state.TRAINING:
            postMessage({type: 'mutation', name: 'updatePaused', payload: true});
            pauseTraining();
            break;
        default:
            break;
    }
};
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
