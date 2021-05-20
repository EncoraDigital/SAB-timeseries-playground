<template>
  <div
    id="graph-histogram-container"
    class="graph"
  >
    <LabelWithTip
      text-label="Training Residuals"
      text-tip="Training residuals distribution.
                For a well-trained model, the residuals
                should look like a normal distribution."
    />
    <div class="border-graph">
      <div
        :id="this.$props.name"
        class="graph-container"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Plotly from '../../custom-plotly';

// Components
import LabelWithTip from '../LabelWithTip/LabelWithTip';

// Styles
import './style.sass';

export default {
  name: 'ResidualsGraph',
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
  computed: mapState(['residuals', 'training']),
  mounted() {
    this.renderGraph();
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'resetStore': {
          this.renderGraph();
          break;
        }

        case 'resetGraphs': {
          this.renderGraph();
          break;
        }
        case 'updateResiduals': {
          this.renderGraph();
          break;
        }
        case 'onPredictionEnd': {
          this.renderGraph();
          break;
        }
        case 'clear': {
          this.renderGraph();
          break;
        }
        default:
          break;
      }
    });
  },
  methods: {
    renderGraph() {
      const update = {
        x: this.residuals,
        type: this.$props.type,
      };
      const layout = {
        autosize: true, // this make the graph fit in the div
        showlegend: false,
        hovermode: false, // this make the tooltips on the points be disabled
        bargap: 0.5,
        barmode: 'stack',
        xaxis: {
          showticklabels: false,
          showgrid: false, // relative to the divider lines
          showline: true,
          zeroline: false,
        },
        yaxis: {
          showticklabels: false,
          showline: true,
          zeroline: false,
          showgrid: false, // relative to the divider lines

          rangemode: 'nonnegative',
        },
        // relative to inner graph box
        margin: {
          l: 4, // margin left
          r: 0, // margin right
          b: 2, // margin bottom
          t: 0, // margin top
          pad: 0, // padding
        },
      };

      Plotly.newPlot(this.$props.name, [update], layout, {
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
