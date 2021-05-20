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
import './style.sass';
import metricsNames from '@/constants/metrics';
import { mapState } from 'vuex';
import LabelWithTip from '../LabelWithTip/LabelWithTip';

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

<style>
</style>
