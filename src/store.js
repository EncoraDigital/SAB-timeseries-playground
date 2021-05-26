import { createStore } from 'vuex';
// Constants
import { datasetParameters, inputFormat, modelHyperparameters } from './constants/parameters';

const dataWorker = new Worker('./model/worker.js', { type: 'module' });
let meName = 'me';

const getDefaultState = () => ({
  datasetSplit: datasetParameters.split.default,
  datasetId: datasetParameters.dataset.default,

  modelHyperparameters: {
    learningRate: modelHyperparameters.learningRate.default,
    activation: modelHyperparameters.activation.default,
    neurons: modelHyperparameters.neurons.default,
    epochs: modelHyperparameters.epochs.default,
    batchSize: modelHyperparameters.batchSize.default,
  },
  inputFormat: {
    autoregressiveLags: inputFormat.autoregressiveLags.default,
    seasonLags: inputFormat.seasonLags.default,
  },
  metrics: {
    me: 0,
    rmse: 0,
    mape: 0,
    mse: 0,
    mae: 0,
  },
  metricsLoss: [],
  testMetrics: {
    me: 0,
    rmse: 0,
    mape: 0,
    mse: 0,
    mae: 0,
    loss: [],
  },
  testMetricsLoss: [],
  residuals: [],
  predictions: [],
  predictionIntervals: { upperBound: [], lowerBound: [] },
  training: false,
  paused: false,
  epochsLeft: modelHyperparameters.epochs.default,
});

// eslint-disable-next-line new-cap
const store = new createStore({

  state: getDefaultState,
  actions: {
    onEpochEnd(context, {
      metrics, metricsLoss, testMetrics, testMetricsLoss, residuals,
    }) {
      context.commit('updateMetrics', metrics);
      context.commit('updateAddLoss', metricsLoss);
      context.commit('updateTestMetrics', testMetrics);
      context.commit('updateTestAddLoss', testMetricsLoss);
      context.commit('updateResiduals', residuals);
    },
    resetAction(context) {
      dataWorker.postMessage({ type: 'reset' });
      context.commit('updateTraining', false);
      context.commit('updatePaused', false);
      context.commit('updateMetrics', getDefaultState().metrics);
      context.commit('updateLoss', getDefaultState().metricsLoss);
      context.commit('updateTestMetrics', getDefaultState().testMetrics);
      context.commit('updateTestLoss', getDefaultState().testMetricsLoss);
      context.commit('updateResiduals', getDefaultState().residuals);
      context.commit('updatePredictions', getDefaultState().predictions);
      context.commit('updatePredictionIntervals', getDefaultState().predictionIntervals);
    },
    resetMetrics(context) {
      context.commit('updateMetrics', getDefaultState().metrics);
      context.commit('updateTestMetrics', getDefaultState().testMetrics);
    },
    resetLoss(context) {
      context.commit('updateLoss', getDefaultState().metricsLoss);
      context.commit('updateTestLoss', getDefaultState().testMetricsLoss);
    },
    resetResiduals(context) {
      context.commit('updateResiduals', getDefaultState().residuals);
    },
    resetPredictions(context) {
      context.commit('updatePredictions', getDefaultState().predictions);
      context.commit('updatePredictionIntervals', getDefaultState().predictionIntervals);
    },
    resetState(context) {
      context.commit('updateState', getDefaultState());
    },
    startTraining(context) {
      context.commit('updateTraining', true);
      context.commit('updatePaused', false);
      dataWorker.postMessage({ type: 'start' });
    },

  },
  mutations: {
    updateEpochsLeft(state, value) {
      state.epochsLeft = value;
    },
    updateDatasetId(state, value) {
      state.datasetId = value;
      dataWorker.postMessage({ type: 'updateDatasetId', payload: value });
    },
    updateDatasetSplit(state, value) {
      state.datasetSplit = value;
      dataWorker.postMessage({ type: 'updateDatasetSplit', payload: value });
    },
    updateModelHyperparameters(state, { parameter, value }) {
      state.modelHyperparameters[parameter] = value;
      dataWorker.postMessage({
        type: 'updateModelHyperparameters',
        payload: JSON.parse(JSON.stringify(state.modelHyperparameters)),
      });
    },
    updateinputFormat(state, { parameter, value }) {
      state.inputFormat[parameter] = value;
      dataWorker.postMessage({ type: 'updateinputFormat', payload: JSON.parse(JSON.stringify(state.inputFormat)) });
    },
    updateMetrics(state, value) {
      state.metrics.mse = value.mse.toFixed(2);
      state.metrics.mae = value.mae.toFixed(2);
      state.metrics.mape = value.mape.toFixed(2);
      state.metrics.me = value[meName] ? value[meName].toFixed(2) : Number(0.00);
      state.metrics.rmse = value.rmse.toFixed(2);
    },
    updateAddLoss(state, value) {
      state.metricsLoss.push(value.toFixed(2));
    },
    updateLoss(state, value) {
      state.metricsLoss = value;
    },
    updateTestMetrics(state, value) {
      state.testMetrics.mse = value.mse.toFixed(2);
      state.testMetrics.mae = value.mae.toFixed(2);
      state.testMetrics.mape = value.mape.toFixed(2);
      state.testMetrics.me = value[meName] ? value[meName].toFixed(2) : Number(0.00);
      state.testMetrics.rmse = value.rmse.toFixed(2);
    },
    updateTestLoss(state, value) {
      state.testMetricsLoss = value;
    },
    updateTestAddLoss(state, value) {
      state.testMetricsLoss.push(value.toFixed(2));
    },
    updateResiduals(state, value) {
      state.residuals = value;
    },
    updatePredictions(state, value) {
      state.predictions = value;
    },
    updatePredictionIntervals(state, value) {
      state.predictionIntervals = value;
    },
    updateTraining(state, value) {
      state.training = value;
    },
    updatePaused(state, value) {
      state.paused = value;
    },
    updateState(state, value) {
      Object.assign(state, value);
    },
  },

  getters: {
    parametersAndInputFormat: (state) => (
      {
        datasetParameters: { dataset: state.datasetId, split: state.datasetSplit },
        modelHyperparameters: state.modelHyperparameters,
        inputFormat: state.inputFormat,
      }
    ),
    modelHyperparameters: (state) => state.modelHyperparameters,
    metrics: (state) => state.metrics,
    metricsLoss: (state) => state.metricsLoss,

    training: (state) => state.training,
    paused: (state) => state.paused,
    datasetId: (state) => state.datasetId,
    datasetSplit: (state) => state.datasetSplit,
    residuals: (state) => state.residuals,
    predictions: (state) => state.predictions,
    predictionIntervals: (state) => state.predictionIntervals,
    testMetrics: (state) => state.testMetrics,
    testMetricsLoss: (state) => state.testMetricsLoss,

    epochsLeft: (state) => state.epochsLeft,
    getInputFormat: (state) => state.inputFormat,
  },
});

dataWorker.onmessage = async (e) => {
  switch (e.data.type) {
    case 'mutation':
      store.commit(e.data.name, e.data.payload);
      break;
    case 'meUpdate':
      meName = e.data.payload;
      break;
    default: {
      if (store.getters.training) {
        await store.dispatch(e.data.name, e.data.payload);
      }
      break;
    }
  }
};

dataWorker.postMessage({ type: 'setup', payload: JSON.parse(JSON.stringify(store.getters.parametersAndInputFormat)) });

export default store;
