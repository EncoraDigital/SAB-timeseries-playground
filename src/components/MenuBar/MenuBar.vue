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
                v-if="pausable"
                icon="pause"
                size="lg"
            />
            <font-awesome-icon
                v-else
                icon="play"
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
    <div class="menu-divider"/>
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
import { modelHyperparameters } from '@/constants/parameters';
import LabelWithTip from '../LabelWithTip/LabelWithTip.vue';
import DropdownContainer from '../DropdownContainer/DropdownContainer.vue';

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
    pausable() {
      return this.training && !this.paused;
    },
    epochPercentageComplete() {
      return (100 * this.epochsLeft) / this.epochs;
    },
    timerStyle() {
      return { 'stroke-dashoffset': this.epochPercentageComplete + 1 };
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

<style lang="sass">
@import './../../constants/variables.sass'

.responsive
  width: 100%
  max-width: 3rem
  min-width: 24px
  height: auto

.menu-bar-container
  background-color: #FFFFFF
  height: 9.250rem
  border-bottom: 1px solid #C6C6C6
  width: 100%
  padding: 1.37rem 2.063rem
  margin: 0 auto
  display: flex
  justify-content: space-between
  align-items: stretch

  span
    line-height: 1em !important

.play-button-container
  display: flex
  justify-content: space-between
  flex-direction: column

.menu-divider
  width: 1px
  background-color: rgba(0, 0, 0, 0.5)
  margin: 0 3em

.hyperparameters-input-items
  flex-grow: 1
  flex-basis: 0

  .label-with-tip
    padding-bottom: 0.6rem

.hyperparameters-input-items + .hyperparameters-input-items
  margin-left: 2rem

.hyperparameters-container
  display: flex
  justify-content: space-between
  flex-direction: column
  flex: 1

.hyperparameters-input-container
  display: flex

.no-padding
  padding: 0

.play-button-controllers
  display: flex
  justify-content: space-between
  margin-bottom: 0.2em

.disabled
  filter: grayscale(100%)
  opacity: 0.5

.button-item
  transition: all linear 100ms
  cursor: pointer
  border-radius: 50%
  text-align: center
  line-height: 3.5em
  width: 3.5em
  height: 3.5em

  position: relative

  &:nth-of-type(even)
    background: #F3931B
    color: white
    margin: 0 0.6em

  &:nth-of-type(odd)
    color: #19204E

  div
    border-radius: 50%

.rotate-hover
  transition: 0.9s ease-in-out

.rotate-hover:hover
  transform: rotateZ(360deg)

#circular-svg
  position: absolute
  width: 3.92em
  height: 3.92em
  top: -0.21em
  left: -0.21em

.progress-bar__background
  fill: none

.progress-bar__progress
  fill: none
  stroke: #c56900
  stroke-dasharray: 100 100
  stroke-dashoffset: 0
  stroke-linecap: round
  stroke-width: 0.15rem

.disabled
  color: gray !important
  cursor: unset !important
</style>
