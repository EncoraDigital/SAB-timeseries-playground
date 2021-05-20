<template>
  <div id="input-format-container">
    <LabelWithTip
      text-label="Input Format"
      text-tip="Customize the input format to train the Neural Network."
    />
    <DropdownContainer
      :default-value="inputFormat.autoregressiveLags.default"
      :dropdown-items="inputFormat.autoregressiveLags.values"
      :dropdown-key="inputFormat.autoregressiveLags.key"
      :dropdown-label="inputFormat.autoregressiveLags.label"
      action="updateinputFormat"
      class="input-format-item"
      tip="Controls the immediate number of past observations
           to be used as input to the Neural Network. If you choose
           a value like 2, the NN will receive the last two
           observations as input to predict the next one."
    />
    <DropdownContainer
      :default-value="inputFormat.seasonLags.default"
      :dropdown-items="inputFormat.seasonLags.values"
      :dropdown-key="inputFormat.seasonLags.key"
      :dropdown-label="inputFormat.seasonLags.label"
      action="updateinputFormat"
      class="input-format-item"
      tip="For seasonal data, it is useful to add some historical
          observations from the same season as input. Define how
          many past observations from the same season the
          network receives as input."
    />
  </div>
</template>

<script>
import DropdownContainer from '@/components/DropdownContainer/DropdownContainer';
import LabelWithTip from '@/components/LabelWithTip/LabelWithTip';
import { inputFormat } from '@/constants/parameters';
import './style.sass';

export default {
  name: 'InputFormat',
  components: { DropdownContainer, LabelWithTip },
  data() {
    return {
      inputFormat,
    };
  },
};
</script>

<style>
</style>
