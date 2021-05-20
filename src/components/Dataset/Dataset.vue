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

import './style.sass';

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
      this.hideTimer = setTimeout(() => { self.visible = 0; }, 5000);
    },
  },
};
</script>

<style>
</style>
