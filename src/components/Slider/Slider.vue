<template>
  <div class="slide-container">
    <ul class="range-labels">
      <li
        v-for="index in 9"
        :key="index"
      >
        {{ (10 - index) * 10 }}
      </li>
      <div
        id="testing-label"
        class="slider-label"
      >
        Test
      </div>
    </ul>
    <div class="dashes">
      <div
        v-for="index in 9"
        :key="index"
      />
    </div>
    <input
      id="myRange"
      v-model="sliderVal"
      :step="this.$props.step"
      class="slider"
      max="90"
      min="10"
      type="range"
      @change="handleCurrentValue"
    >
    <ul class="range-labels">
      <div
        id="training-label"
        class="slider-label"
      >
        Train
      </div>
      <li
        v-for="index in 9"
        :key="index"
      >
        {{ (index) * 10 }}
      </li>
    </ul>
  </div>
</template>

<script>
import './style.sass';

export default {
  name: 'Slider',
  props: {
    defaultValue: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      sliderVal: '',
    };
  },
  mounted() {
    this.sliderVal = this.defaultValue;

    this.$store.subscribe((mutation) => {
      if (mutation.type === 'resetStore') {
        this.sliderVal = this.defaultValue;
      }
    });
  },
  methods: {
    handleCurrentValue() {
      const value = this.sliderVal;
      this.$store.commit('updateDatasetSplit', value);
      this.$store.dispatch('resetPredictions');
    },
  },
};
</script>

<style>
</style>
