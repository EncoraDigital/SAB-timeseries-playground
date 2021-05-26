<template>
  <div
    :class="{ selected:datasetKey === datasetId}"
    :style="style"
    class="dataset"
    @click="handleCurrentValue"
  >
    <div
      v-if="datasetKey === datasetId"
      :style="fillStyle"
      class="fill"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Dataset',
  props: {
    imgSrc: {
      type: String,
      required: true,
    },
    datasetKey: {
      type: Number,
      required: true,
    },
  },
  data() {
    return { visible: 0, hideTimer: 0 };
  },
  computed: {
    ...mapState(['datasetSplit', 'datasetId']),

    style() {
      return { backgroundImage: `url(${this.imgSrc})` };
    },
    fillStyle() {
      return { width: `${+this.datasetSplit}%`, opacity: this.visible };
    },
  },
  methods: {
    handleCurrentValue() {
      this.show();
      const value = this.$props.datasetKey;
      this.$store.commit('updateDatasetId', value);
    },
    show() {
      clearTimeout(this.hideTimer);
      this.visible = 1;
      const self = this;
      this.hideTimer = setTimeout(() => {
        self.visible = 0;
      }, 5000);
    },
  },
};
</script>

<style lang="sass">
@import './../../constants/variables.sass'

.dataset
  height: 4.000em
  cursor: pointer
  width: auto
  background: #FFFFFF
  background-size: cover
  border: 1px solid #c2c2c2
  border-radius: 4px
  opacity: 0.7

.dataset.selected
  border: 2px solid #252d65 !important
  opacity: 1

.dataset:hover
  border: 1px solid #5c5c5c

.dataset + .dataset
  margin-top: 1.500rem

.dataset-selected
  box-shadow: 0 0 5px rgba(81, 203, 238, 1)
  border: 1px solid rgba(81, 203, 238, 1)

.fill
  transition: width ease-in-out 1s, opacity ease-in-out 200ms
  height: 100%
  background-color: rgba(255, 196, 0, 0.08)
  border: 1px solid #CC7804
  box-sizing: border-box
  border-radius: 4px
</style>
