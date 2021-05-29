<template>
  <div id="content">
    <DatasetParameters />
    <InputFormat />
    <MainGraph
      name="mainGraph"
      type="scatter"
    />
    <Metrics id="metrics" />
    <LossGraph id="loss-graph" />
    <ResidualsGraph
      id="histogram"
      name="histogramGraph"
      type="histogram"
    />
    <div class="arrow">
      <a href="#text-description-wrapper">
        <img
          alt="Go to the article"
          src="@/assets/arrow-down.svg"
        >
      </a>
    </div>
  </div>
</template>

<script>
// Components
import DatasetParameters from '../DatasetParameters/DatasetParameters.vue';
import InputFormat from '../InputFormat/InputFormat.vue';
import MainGraph from '../MainGraph/MainGraph.vue';
import Metrics from '../Metrics/Metrics.vue';
import LossGraph from '../LossGraph/LossGraph.vue';
import ResidualsGraph from '../ResidualsGraph/ResidualsGraph.vue';

export default {
  name: 'MainContent',
  components: {
    DatasetParameters, InputFormat, MainGraph, Metrics, LossGraph, ResidualsGraph,
  },
};
</script>

<style lang="sass">
#content
  background: #EEF2F8
  position: relative
  padding: 2rem 2rem 40px
  grid-column-gap: 1.8rem
  grid-row-gap: 1.8rem
  display: -ms-grid
  display: grid
  justify-items: stretch
  -webkit-box-align: stretch
  -ms-flex-align: stretch
  align-items: stretch

.arrow
  background: #EEF2F8
  border-radius: 0 0 50% 50%
  height: 70px
  width: 100%
  position: absolute
  display: flex
  bottom: 0
  margin-bottom: -30px

.arrow a
  margin: 0 auto

.arrow img
  margin: 20px auto
  width: 2.375em
  height: 1.438em

.arrow
  grid-area: arrow

#sidebar
  -ms-grid-row: 1
  -ms-grid-row-span: 7
  -ms-grid-column: 1
  grid-area: sidebar

#main-graph
  -ms-grid-row: 1
  -ms-grid-row-span: 5
  -ms-grid-column: 3
  -ms-grid-column-span: 7
  grid-area: main-graph

#metrics
  -ms-grid-row: 7
  -ms-grid-column: 3
  -ms-grid-column-span: 3
  grid-area: metrics

#loss-graph
  -ms-grid-row: 7
  -ms-grid-column: 7
  grid-area: loss-graph

#histogram
  -ms-grid-row: 7
  -ms-grid-column: 9
  grid-area: histogram

#input-format-container
  grid-area: input

#dataset-container
  grid-area: dataset

#content
  -ms-grid-columns: 1fr 1.9rem 1fr 1.9rem 1fr 1.9rem 1fr 1.9rem 1fr
  grid-template-columns: minmax(0, 17.59fr) minmax(0, 17.89fr) minmax(0, 17.89fr) minmax(0, 18.38fr) minmax(0, 18.38fr)
  -ms-grid-rows: 1fr 1.9rem 1fr 1.9rem 1fr 1.9rem 1fr
  grid-template-rows: 1fr 1fr 1fr minmax(0, 210px)
  grid-template-areas: "dataset main-graph main-graph main-graph main-graph" "dataset main-graph main-graph main-graph main-graph" "dataset main-graph main-graph main-graph main-graph" "input metrics metrics loss-graph histogram"

@media only screen and (min-width: 700px) and (max-width: 1025px)
  #content
    grid-template-areas: "dataset main-graph main-graph main-graph main-graph""dataset main-graph main-graph main-graph main-graph"  "input metrics metrics metrics metrics" "none loss-graph loss-graph histogram histogram"
</style>
