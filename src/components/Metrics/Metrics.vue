<template>
  <div class="metrics-panel">
    <div class="metric-labels">
      <div class="metric-label-item">
        <div class="blue" />
        Testing
      </div>
      <div class="metric-label-item">
        <div class="gray" />
        Training
      </div>
    </div>
    <LabelWithTip
      text-label="Metrics"
      text-tip="Common metrics for Time Series training"
    />
    <div class="metrics-container">
      <div
        v-for="(metric, index) in metricsNames"
        :key="index"
        class="metrics-item"
      >
        <span class="metric-number-label primary">{{ testMetrics[metric.name] }}</span>
        <span class="metric-number-label secondary">{{ metrics[metric.name] }}</span>
        <LabelWithTip
          :text-label="metric.name"
          :text-tip="metric.description"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import metricsNames from '@/constants/metrics';
import LabelWithTip from '../LabelWithTip/LabelWithTip.vue';

export default {
  name: 'Metrics',
  components: { LabelWithTip },
  data() {
    return {
      metricsNames,
      style: {
        fontSize: '0.6em',
      },
    };
  },
  computed: mapState(['metrics', 'testMetrics']),
};
</script>

<style lang="sass">
.metric-number-label
  display: block

.metric-number-label.primary
  font-size: 2rem
  margin-bottom: 1rem
  font-weight: 500
  color: #19204E

.metric-number-label.secondary
  font-size: 1.125rem
  margin-bottom: 2em
  color: #858AAC

.metrics-container
  padding-top: 0.6rem
  height: auto
  display: flex

  .label
    font-family: "Roboto Regular", sans-serif
    font-style: normal
    font-weight: normal
    font-size: 0.875rem !important
    line-height: 16.16px
    color: #19204E
    text-transform: uppercase

.metrics-panel
  position: relative
  border-radius: 4px
  border: 1px solid #C6C6C6
  padding: 0.6rem 0 -0rem 1.5rem
  box-sizing: border-box
  background: #FFFFFF

.metrics-item
  height: 100%
  display: flex
  flex: 1
  flex-direction: column
  justify-content: center

.metrics-item + .metrics-item
  border-left: 1px solid rgba(0, 0, 0, 0.5)
  padding-left: 1rem

.metric-labels
  position: absolute
  right: 0
  top: 0
  padding: 1.5rem

  .metric-label-item
    display: inline-block
    line-height: 1rem
    margin-left: 2rem

    div
      width: 1rem
      height: 1rem
      background: black
      display: inline-block
      margin-right: 0.5rem

    .blue
      background-color: #19204E

    .gray
      background-color: #858AAC
</style>
