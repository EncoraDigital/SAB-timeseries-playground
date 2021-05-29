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
      :img-src="image1"
    />
    <Dataset
      :dataset-key="1"
      :img-src="image2"
    />
    <Dataset
      :dataset-key="2"
      :img-src="image3"
    />
    <Dataset
      :dataset-key="3"
      :img-src="image4"
    />
  </div>
</template>

<script>
import { datasetParameters } from '@/constants/parameters';
import image1 from '../../assets/Images/international_airline_passengers.jpg';
import image2 from '../../assets/Images/us_electricity_generation.jpg';
import image3 from '../../assets/Images/uk_gas_consumption.jpg';
import image4 from '../../assets/Images/australian_beer_production.jpg';

import LabelWithTip from '../LabelWithTip/LabelWithTip.vue';
import Slider from '../Slider/Slider.vue';
import Dataset from '../Dataset/Dataset.vue';

export default {
  name: 'DatasetParameters',
  components: { Slider, LabelWithTip, Dataset },
  data() {
    return {
      datasetParameters,
      image1,
      image2,
      image3,
      image4,

    };
  },
};
</script>

<style lang="sass">
#dataset-container
  border-bottom: 1px solid rgba(0, 0, 0, 0.5)
  padding-bottom: 2em

#dataset-container
  span
    line-height: 1em
    padding-bottom: 0.5em
</style>
