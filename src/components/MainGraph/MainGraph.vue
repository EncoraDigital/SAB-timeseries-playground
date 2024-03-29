<template>
  <article
    id="main-graph"
    class="graph"
  >
    <LabelWithTip
      :custom-style="style"
      :text-label="dataset.title"
      :text-tip="dataset.description"
    />
    <div class="graph-holder">
      <div
        :id="this.$props.name"
        class="graph-container"
      />
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import Plotly from '../../custom-plotly';
import getDatasetById from '../../model/datasets';
import LabelWithTip from '../LabelWithTip/LabelWithTip.vue';

export default {
  name: 'MainGraph',
  components: { LabelWithTip },
  props: {
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      title: '',
      style: {
        fontSize: '2rem',
        marginBottom: '0px',
      },
      layout: {
        autosize: true,
        paper_bgcolor: '#fff',
        plot_bgcolor: '#fff',
        showlegend: true,
        hovermode: true,
        margin: {
          l: 0,
          r: 0,
          b: 50,
          t: 20,
          pad: 0,
        },
        xaxis: {
          title: 'Time',
          type: 'date',
          zeroline: true,
          showline: true,
          showgrid: false,
          autotick: false,
          dtick: 'M12', // data shows every 12 months
          ticklen: 8,
          tickcolor: '#000',
          automargin: true,
        },
        yaxis: {
          automargin: true,
          title: 'Dataset values',
          zeroline: true,
          showline: true,
          showgrid: false,
          autotick: true,
          rangemode: 'nonnegative',
          ticklen: 8,
          tickcolor: '#000',
        },
        legend: {
          y: -0.2,
          x: 0,
          orientation: 'h',
        },
      },

    };
  },
  computed: {
    trainSize() {
      return Math.floor((this.datasetSplit * this.dataset.data.length) / 100);
    },
    dateList() {
      return this.getDateTimeListAsync(
        this.dataset.start,
        this.dataset.end,
        this.dataset.frequency,
      );
    },
    dateListTrain() {
      return this.dateList.slice(0, this.yTrain.length);
    },
    dateListTest() {
      return this.dateList.slice(this.yTrain.length, this.dateList.length);
    },
    yTrain() {
      return this.dataset.data.slice(0, this.trainSize);
    },
    yTest() {
      return this.dataset.data.slice(this.trainSize, this.dataset.data.length);
    },
    xTest() {
      return this.dateList.slice(this.yTrain.length, this.dateList.length);
    },
    xTrain() {
      return this.dateList.slice(0, this.yTrain.length);
    },
    dataset() {
      return getDatasetById(this.datasetId);
    },
    traces() {
      return [
        {
          y: this.yTrain,
          x: this.dateListTrain,
          name: 'Train',
          mode: 'lines',
          type: 'scatter',

        },
        {
          y: this.yTest,
          x: this.dateListTest,
          name: 'Test',
          mode: 'lines',
          type: 'scatter',

        },
        {
          line: { width: 0.5 },
          mode: 'lines',
          name: 'Confidence Interval Upper Bound',
          type: 'scatter',
          x: this.dateListTest,
          y: this.predictionIntervals.upperBound,
          marker: { color: 'rgba(51,204,255,0.3)' },
          fillcolor: 'rgba(51,204,255,0.3)',
          showlegend: false,
        },
        {
          fill: 'tonexty',
          line: { width: 0.5 },
          mode: 'lines',
          name: 'Confidence Interval',
          type: 'scatter',
          x: this.dateListTest,
          y: this.predictionIntervals.lowerBound,
          marker: { color: 'rgba(51,204,255,0.3)' },
          fillcolor: 'rgba(51,204,255,0.3)',
        },
        {
          y: this.predictions,
          x: this.xTest,
          mode: 'lines',
          name: 'Prediction',
          type: 'scatter',

        }];
    },
    ...mapState([
      'datasetId',
      'datasetSplit',
      'training',
      'predictions',
      'predictionIntervals',
    ]),
  },
  watch: {

    datasetId() {
      this.showGraph();
    },
    datasetSplit() {
      this.showGraph();
    },
    predictions() {
      this.showGraph();
    },
  },

  mounted() {
    Plotly.newPlot(this.$props.name, this.traces, this.layout, {
      displayModeBar: false,
      responsive: true,
    });

    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'resetGraphs':
          this.showGraph();
          break;
        default:
          break;
      }
    });
  },
  methods: {
    getDateTimeListAsync(start, end, freq) {
      const dateList = [];
      const dateMove = new Date(start);

      let strDate = start;
      let dateIncreament = null;

      switch (freq) {
        case 12:
          dateIncreament = 1;
          break;
        case 4:
          dateIncreament = 3;
          break;
        default:
          break;
      }

      while (strDate < end) {
        strDate = dateMove.toISOString().slice(0, 7);
        dateList.push(strDate);
        dateMove.setMonth(dateMove.getMonth() + dateIncreament);
      }
      return dateList;
    },
    showGraph() {
      Plotly.react(this.$props.name, this.traces, this.layout);
      // Plotly.update(this.$props.name)
    },
  },

};
</script>

<style>
</style>
