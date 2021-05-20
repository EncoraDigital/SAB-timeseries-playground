export const modelHyperparameters = {
  learningRate: {
    key: 'learningRate',
    label: 'Learning Rate',
    default: 0.4,
    values: [2, 1, 0.4, 0.1, 0.04, 0.01, 0.001],
    tip: 'Controls the step size in the direction of the gradient at each step of training. If too small, it may take longer to converge. If too large, training might diverge.',
  },
  activation: {
    key: 'activation',
    label: 'Activation',
    default: 'relu',
    values: ['relu', 'tanh', 'sigmoid', 'linear'],
    tip: 'The type of activation function to use. Remember, if you choose linear, your Neural Net behaves like a linear model.',
  },
  neurons: {
    key: 'neurons',
    label: 'Neurons',
    default: 4,
    values: [2, 4, 6, 8, 10, 12],
    tip: 'The number of neurons for the single hidden layer of the Neural Network.',
  },
  epochs: {
    key: 'epochs',
    label: 'Epochs',
    default: 32,
    values: [8, 16, 32, 64, 128],
    tip: 'The number of complete sweeps over the training data.',
  },
  batchSize: {
    key: 'batchSize',
    label: 'Batch Size',
    default: 16,
    values: [8, 16, 32, 64, 128],
    tip: 'The number of observations to feed the Neural Network at each iteration.',
  },
};

export const datasetParameters = {
  split: { key: 'split', label: 'split', default: 90 },
  dataset: { default: 0 },
};

export const inputFormat = {
  autoregressiveLags: {
    key: 'autoregressiveLags',
    label: 'Number of AutoRegressive Lags',
    default: 1,
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  seasonLags: {
    key: 'seasonLags', label: 'Number of Season Lags', default: 1, values: [1, 2, 3, 4, 5, 6],
  },
};
