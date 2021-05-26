/* eslint-disable no-console,max-len */
import {
  add,
  cast,
  concat,
  div,
  exp,
  gather,
  log,
  mean,
  mul,
  pow,
  range,
  reshape,
  slice,
  sqrt,
  square,
  sub,
  Tensor,
  tidy,
  tile,
  train,
  util,
} from '@tensorflow/tfjs-core';
import {
  layers,
  sequential,

} from '@tensorflow/tfjs-layers';
/**
 * Perform dataset train/test split
 * @param {Tensor} data - 1D Tensor. A time series dataset
 * @param {Number} minLength - Scalar representing the mininum length of a sequence
 * @returns {{xTest: Tensor, xTrain: Tensor}} Returns the train and test data
 */
export const trainTestSplit = (data, minLength, trainSizePercent) => {
  console.assert(minLength >= 0, 'The value for parameter [minLength] has to be greater than 0');
  console.assert(((trainSizePercent > 0) && (trainSizePercent < 1)), 'The test size percentage has to be between [0-1]');

  return tidy(() => {
    const trainSize = parseInt(trainSizePercent * data.shape[0], 10);
    const testSize = data.shape[0] - trainSize;

    // compute indices for train and test split
    const trainIndices = cast(range(0, trainSize), 'int32');
    const testIndices = cast(range(data.shape[0] - (testSize + minLength - 1), data.shape[0]), 'int32');

    // splits timeseries data in train/test sets
    const xTrain = gather(data, trainIndices);
    const xTest = gather(data, testIndices);

    return {
      xTrain,
      xTest,
    };
  });
};

/**
 * Perform dataset train/test split using javascript arrays
 * @param {Array} data - 1D array. A time series dataset
 * @param {Number} trainSizePercent - scalar represeting the split data proportion - value between [0,1]
 * @returns {{xTest: *[], xTrain: *[]}} Where resolve, it is a dictionary containing 2 lists - The train and test sets.
 */
export const trainTestSplitJS = (data, trainSizePercent) => {
  console.assert(((trainSizePercent > 0) && (trainSizePercent < 1)), 'The test size percentage has to be between [0-1]');

  const trainSize = parseInt(trainSizePercent * data.length, 10);
  const xTrain = data.slice(0, trainSize);
  const xTest = data.slice(trainSize, data.length);
  return { xTrain, xTest };
};

/**
 * Generate an array of date strings.
 *  dataset = getDatasetById(id);
 const dateListPromise = getDateTimeListAsync(dataset.start, dataset.end, dataset.frequency);

 // resolve the promise
 dateListPromise.then(function (dateList) {
        // the date list is here!
    });
 * @date 2019-09-19
 * @param {String} start: Stating date string
 * @param {String} end: Ending date string
 * @param {Number} freq: Frequency of the time series
 * @returns {Promise}: When resolved, outputs a List of date strings
 */
export const getDateTimeListAsync = (start, end, freq) => {
  const dateList = [];
  const dateMove = new Date(start);

  let strDate = start;
  let dateIncreament = null;

  switch (freq) {
    case 12:
      dateIncreament = 1;
      break;
    case 4:
      dateIncreament = 3;
      break;
    default:
      break;
  }

  while (strDate < end) {
    strDate = dateMove.toISOString().slice(0, 7);
    dateList.push(strDate);
    dateMove.setMonth(dateMove.getMonth() + dateIncreament);
  }
  return dateList;
};

/**
 * Perform boxcox transformation to 1D Tensor
 * @date 2019-08-30
 * @param {Tensor} data - 1D Tensor to be transformed
 * @param {Number} lambda_ - Scalar parameter used to transform the input data
 * @returns {Tensor} Returns the input data with boxcox transformation
 */
export const boxCoxTransform = (data, lambda_) => {
  // Based on implementation descrived at: https://otexts.com/fpp2/transformations.html
  util.assert(data instanceof Tensor, 'Input time series must be a Tensor Object.');
  console.assert(typeof lambda_ === 'number', {
    value: lambda_,
    errorMsg: 'Input lambda parameter must be of type number:',
  });

  return tidy(() => {
    if (lambda_ === 0) {
      // simple natural log transform (base e)
      return log(data);
    }

    // perform power transform
    return div(sub(pow(data, lambda_), 1), lambda_);
  });
};

/**
 * Perform boxcox inverse transformation to 1D Tensor
 * @date 2019-08-30
 * @param {Tensor} data - 1D boxcox transformed Tensor
 * @param {Number} lambda_ - Value used to boxcox transform the input data
 * @returns {Tensor} - Returns the input data with boxbox inversed transformation. The output has the same shape and type as the input.
 */
export const boxCoxInvTransform = (data, lambda_) => {
  // BSased on implementation descrived at: https://otexts.com/fpp2/transformations.html
  util.assert(data instanceof Tensor, 'Input time series must be a Tensor Object.');
  console.assert(typeof lambda_ === 'number', {
    value: lambda_,
    errorMsg: 'Input lambda parameter must be of type number:',
  });

  return tidy(() => {
    // perform inv boxcox transform
    if (lambda_ === 0) {
      return exp(data);
    }

    return pow(add(mul(data, lambda_), 1), div(1, lambda_));
  });
};

/**
 * Compute the standard deviation of a 1D Tensor
 * @date 2019-08-30
 * @param {Tensor} data - 1D Tensor
 * @param {Number} mean - The mean of the input data
 * @returns {Number} Returns the standard deviation of the input data
 */
export const getStd = (data, meanValue) => tidy(() => sqrt(mean(square(sub(data, meanValue)))));

/**
 * Perform Z-Index normalization
 * @date 2019-08-30
 * @param {Tensor} data - 1-D Tensor to be normalized
 * @returns {Dict} - Return a dictionary containing the normalized data along with its mean and standar deviation
 */
export const zIndexTransform = (data, meanValue, std) => (
  tidy(() => div(sub(data, meanValue), std))
);
// perform z-index normalization to the time series data

/**
 * Perform Z-Index inverse normalization
 * @date 2019-08-30
 * @param {Tensor} data - 1D Tensor
 * @param {Number} mean - The mean value used to normalized the input data
 * @param {Number} std  - The value of standard deviation used to normalized the input data
 * @returns {Tensor} - Returns the denormalized tensor. The output has the same shape and type as the input.
 */
export const zIndexInvTransform = (data, meanValue, std) => (
  tidy(() => add(mul(data, std), meanValue))
);
// perform inverse z-index normalization
// /**
//  * Generate dataset for autoregressive time series model training.
//  * @date 2019-08-30
//  * @param {Tensor} data: 1D Tensor with numerical values
//  * @param {number} p: Non-seasonal lags
//  * @param {number} P: Seasonal lags
//  * @param {number} freq - The dataset frequency, for monthly data, that should be 12
//  * @returns {Dict} Returns a dictionary containing input and target tensors for training
//  */
export const formatDataset = (data, p, P, freq) => {
  const start = Math.max(P * freq, p);

  return tidy(() => {
    const y = slice(data, [start], [(data.shape[0] - start)]);

    const d = data.shape[0] - start;

    const i = start - p;
    const scalars = range(i, i + p);
    let indices = reshape(tile(scalars, [d]), [d, scalars.shape[0]]);

    const addRange = range(0, indices.shape[0]);
    indices = add(reshape(addRange, [addRange.shape[0], 1]), indices);

    let X = gather(data, cast(indices, 'int32'));

    const nSeasons = data.shape[0] - (P * freq);
    const seasonHorizon = Math.ceil(((P * freq) - p) / freq);

    if (seasonHorizon > 0) {
      let seassonRange = range(0, seasonHorizon * freq, freq);
      seassonRange = tile(seassonRange, [nSeasons]);
      seassonRange = reshape(seassonRange, [nSeasons, seasonHorizon]);

      const addScalar = reshape(range(0, nSeasons), [nSeasons, 1]);

      const seasonValues = gather(data, cast(add(addScalar, seassonRange), 'int32'));
      X = concat([seasonValues, X], -1);
    }

    return {
      X,
      y,
    };
  });
};

// Compute the mean error between prediction and ground truth
// eslint-disable-next-line no-unused-vars
export function me(yTrue, yPred) {
  return tidy(() => mean(sub(yTrue, yPred)));
}

/**
 * Create up to [n] Feed Forward Neural Nets
 * @date 2019-08-30
 * @param {List} inputShape: Data input format to the model
 * @param {number} n: Number of models to be created
 * @returns {*[]} List of Tensorflow models
 */
export const getModels = (inputShape, nNeurons, actFunction, learningRate, n = 1) => {
  console.assert(n >= 1, 'You need to create at least one model');
  const models = [];

  for (let i = 0; i < n; i += 1) {
    const model = sequential({
      layers: [
        layers.dense({
          inputShape,
          units: nNeurons,
          activation: actFunction,
        }),
        layers.dense({
          units: 1,
        }),
      ],
    });

    model.compile({
      optimizer: train.adam(learningRate),
      loss: 'meanSquaredError',
      metrics: ['mse', 'mae', 'mape', me],
    });

    model.summary();
    models.push(model);
  }
  return models;
};

export const getSingleModel = (inputShape, nNeurons, actFunction, learningRate) => {
  const model = sequential({
    layers: [layers.dense({
      inputShape,
      units: nNeurons,
      activation: actFunction,
    }),
    layers.dense({ units: 1 }),
    ],
  });

  model.compile({
    optimizer: train.adam(learningRate),
    loss: 'meanSquaredError',
    metrics: ['mse', 'mae', 'mape', me],
  });

  model.summary();
  console.log('Model created with success.');
  return model;
};
