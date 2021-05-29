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

<style lang="sass">
.slide-container
  width: 80%
  margin: 0 auto 1.5rem auto

.slider-label
  width: 0
  line-height: 14px
  font-size: 11px
  position: absolute
  font-family: 'Roboto Bold', sans-serif

#testing-label
  right: -15px

#training-label
  left: -40px

.dashes
  display: flex
  flex-direction: row
  height: 1.7em

  justify-content: space-between
  margin: 0 1.38em -1.7em 1.38em

  div
    width: 1.59px
    height: 1.7em
    border-radius: 4px
    background: #F8986D

.slider
  padding: 0 0.9em
  position: relative
  z-index: 1000
  -webkit-appearance: none
  width: 100%
  height: 4px
  background: linear-gradient(90deg, #FEC47C 0%, #F27260 56.25%, #E51842 100%)
  border-radius: 8px
  outline: none
  -webkit-transition: .2s
  transition: opacity .2s
  margin: 0 0 0.8em 0

  &::-webkit-slider-thumb
    -webkit-appearance: none
    appearance: none
    width: 1.2rem
    height: 1.2rem
    background: #F3931B
    border-radius: 4px
    cursor: pointer

  &::-webkit-slider-thumb:hover
    background: #FEC47C

  &::-moz-range-thumb
    appearance: none
    width: 1.2rem
    height: 1.2rem
    background: #F3931B
    border-radius: 4px
    cursor: pointer

.range-labels
  position: relative
  margin: 0.4em 1em
  height: 15px
  padding: 0
  list-style: none
  display: flex
  flex-direction: row
  justify-content: space-between

  li
    text-align: center
    color: #19204E
    font-size: 0.75rem
    cursor: pointer
    font-family: 'Roboto Regular', sans-serif
    @media only screen and (max-width: 1000px)
      &:nth-of-type(even)
        display: none
</style>
