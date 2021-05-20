<template>
  <div class="graph">
    <LabelWithTip
      text-label="Loss"
      text-tip="Visualize training and testing metrics. Note that the model is optimized with MSE."
    />
    <div class="border-graph">
      <div id="LossGraph" />
    </div>
  </div>
</template>

<script>
import Plotly from '@/custom-plotly';
import { mapState } from 'vuex';

// Components
import LabelWithTip from '@/components/LabelWithTip/LabelWithTip';

// Styles
import './style.sass';

export default {
  name: 'LossGraph',
  components: { LabelWithTip },
  data() {
    return {
      layout: {
        autosize: true, // this make the graph fit in the div
        showlegend: true,
        legend: {
          x: 0.7,
          y: 1,
          font: {
            family: 'sans-serif',
            size: 9,
            color: 'black',
          },
        },
        hovermode: false, // this make the tooltips on the points be disabled
        xaxis: {
          title: 'Steps',
          showticklabels: true,
          automargin: true,
          showgrid: false, // relative to the divider lines
          zeroline: true, // relative to the default line
          rangemode: 'nonnegative',
          showline: true,
          tickfont: {
            family: 'Arial',
            size: 11,
            color: 'Gray',
          },
          titlefont: {
            family: 'Arial',
            size: 11,
            color: 'Gray',
          },
        },
        yaxis: {
          title: 'Loss',

          showticklabels: true,
          showline: true,
          showgrid: false,
          zeroline: true,
          automargin: true,

          rangemode: 'nonnegative',
          tickfont: {
            family: 'Arial',
            size: 11,
            color: 'Gray',
          },
          titlefont: {
            family: 'Arial',
            size: 11,
            color: 'Gray',
          },
        },
        // relative to inner graph box
        margin: {
          l: 4, // margin left
          r: 0, // margin right
          b: 2, // margin bottom
          t: 0, // margin top
          pad: 0, // padding
        },
      },
    };
  },
  computed: {
    traces() {
      return [{
        name: 'Test',
        x: Object.keys(this.testMetricsLoss),
        y: Object.values(this.testMetricsLoss),
        line: { width: 1 },
        type: 'scatter',
        mode: 'lines',

      },
      {
        name: 'Train',
        x: Object.keys(this.metricsLoss),
        y: this.metricsLoss,
        line: { width: 1 },
        type: 'scatter',
        mode: 'lines',

      }];
    },
    ...mapState(['metricsLoss', 'testMetricsLoss']),
  },
  watch: {
    metricsLoss: {
      deep: true,
      handler() {
        this.showGraph();
      },
    },
  },
  mounted() {
    this.showGraph();
  },
  methods: {
    showGraph() {
      Plotly.react('LossGraph', this.traces, this.layout, {
        responsive: true,
        displayModeBar: false,
        staticPlot: true,
        hoverinfo: 'none',
      });
    },
  },
};
</script>

<style>
</style>
