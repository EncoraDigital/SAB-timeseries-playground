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
import DatasetParameters from '../DatasetParameters/DatasetParameters';
import InputFormat from '../InputFormat/InputFormat';
import MainGraph from '../MainGraph/MainGraph';
// Styles
import './style.sass';
// Components
import Metrics from '../Metrics/Metrics';
import LossGraph from '../LossGraph/LossGraph';
import ResidualsGraph from '../ResidualsGraph/ResidualsGraph';

export default {
  name: 'MainContent',
  components: {
    DatasetParameters, InputFormat, MainGraph, Metrics, LossGraph, ResidualsGraph,
  },
};
</script>

<style>
</style>
