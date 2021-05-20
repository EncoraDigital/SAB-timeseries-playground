<template>
  <div id="dataset-container">
    <LabelWithTip
      text-label="Dataset Parameters"
      text-tip="Choose a dataset and define proportions for training and testing."
    />
    <Slider
      :default-value="datasetParameters.split.default"
      :step="10"
    />
    <Dataset
      :dataset-key="0"
      :img-src="require('../../assets/Images/international_airline_passengers.jpg')"
    />
    <Dataset
      :dataset-key="1"
      :img-src="require('../../assets/Images/us_electricity_generation.jpg')"
    />
    <Dataset
      :dataset-key="2"
      :img-src="require('../../assets/Images/uk_gas_consumption.jpg')"
    />
    <Dataset
      :dataset-key="3"
      :img-src="require('../../assets/Images/australian_beer_production.jpg')"
    />
  </div>
</template>

<script>
import LabelWithTip from '@/components/LabelWithTip/LabelWithTip';
import { datasetParameters } from '@/constants/parameters';
import Slider from '../Slider/Slider';
import Dataset from '../Dataset/Dataset';
import './style.sass';

export default {
  name: 'DatasetParameters',
  components: { Slider, LabelWithTip, Dataset },
  data() {
    return {
      datasetParameters,
    };
  },
};
</script>
