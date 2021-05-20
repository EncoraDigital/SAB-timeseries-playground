<template>
  <div class="menu-bar-container">
    <div class="play-button-container">
      <div>
        <LabelWithTip
          :custom-style="style"
          text-label="Training"
          text-tip="Control the model training. You can start,
                    pause, or resume training at any time. You
                    can also train for a single epoch at a time.."
        />
      </div>

      <div class="play-button-controllers">
        <div class="button-item">
          <div @click="clear">
            <font-awesome-icon
              class="rotate-hover"
              icon="redo-alt"
              size="lg"
            />
          </div>
        </div>
        <div
          :class="{ disabled: actionButtonDisabled }"
          class="button-item"
          @click="playPause"
        >
          <div>
            <font-awesome-icon
              :icon="playIcon"
              size="lg"
            />
          </div>
          <svg
            v-if="training"
            id="circular-svg"
            viewBox="-1 -1 34 34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              class="progress-bar__background"
              cx="16"
              cy="16"
              r="14"
            />

            <circle
              :style="timerStyle"
              class="progress-bar__progress js-progress-bar"
              cx="16"
              cy="16"
              r="14"
            />
          </svg>
        </div>
        <div class="button-item disabled">
          <div>
            <font-awesome-icon
              icon="step-forward"
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="menu-divider" />
    <div class="hyperparameters-container">
      <div>
        <LabelWithTip
          :custom-style="style"
          text-label="Hyperparameter"
          text-tip="Choose the set of hyperparameters for the Neural Network."
        />
      </div>

      <div class="hyperparameters-input-container">
        <DropdownContainer
          v-for="(parameter, index) in hyperparametersList"
          :key="index"
          :default-value="parameter.default"
          :dropdown-items="parameter.values"
          :dropdown-key="parameter.key"
          :dropdown-label="parameter.label"
          :tip="parameter.tip"
          action="updateModelHyperparameters"
          class="hyperparameters-input-items"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { modelHyperparameters } from '../../constants/parameters';
import LabelWithTip from '../LabelWithTip/LabelWithTip';
import DropdownContainer from '../DropdownContainer/DropdownContainer';
import './style.sass';

export default {
  name: 'MenuBar',

  components: { LabelWithTip, DropdownContainer },
  data() {
    return {
      actionButtonDisabled: false,
      hyperparametersList: modelHyperparameters,

      style: {
        fontSize: '1.45rem',
        marginBottom: '0px',
      },
      trainerHandler: null,
      dataset: null,
      epochs: modelHyperparameters.epochs.default,
    };
  },
  computed: {
    ...mapState([
      'training',
      'paused',
      'datasetId',
      'datasetSplit',
      'epochsLeft',
      'modelHyperparameters',
      'inputFormat',
    ]),
    playIcon() {
      if (this.training && !this.paused) {
        return 'pause';
      }
      return 'play';
    },
    epochPercentageComplete() {
      return (100 * this.epochsLeft) / this.epochs;
    },
    timerStyle() {
      return { 'stroke-dashoffset': this.epochPercentageComplete };
    },
  },

  watch: {

    datasetId(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.actionButtonDisabled) return;
        this.$store.dispatch('resetPredictions');
      }
    },
    training(newValue) {
      if (newValue === false) {
        this.epochs = this.modelHyperparameters.epochs;
      }
    },
  },
  methods: {
    playPause() {
      this.startTraining();
    },

    startTraining() {
      if (this.actionButtonDisabled) return;
      this.actionButtonDisabled = true;
      setTimeout(() => {
        this.actionButtonDisabled = false;
      }, 500);
      this.epochs = this.modelHyperparameters.epochs;
      this.$store.dispatch('startTraining');
    },

    clear() {
      this.$store.dispatch('resetAction');
      this.epochs = this.modelHyperparameters.epochs;
      this.actionButtonDisabled = false;
    },

    pauseTraining() {
      if (this.actionButtonDisabled) return;
      this.actionButtonDisabled = true;
      setTimeout(() => {
        this.actionButtonDisabled = false;
      }, 1000);
    },

    resumeTraining() {
      setTimeout(() => {
        this.actionButtonDisabled = false;
      }, 1000);
    },

    stepForward() {
      if (this.actionButtonDisabled) return;
      this.actionButtonDisabled = true;
      setTimeout(() => {
        this.actionButtonDisabled = false;
      }, 1000);
    },
  },
};
</script>
