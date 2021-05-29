<template>
  <div class="dropdown-container">
    <LabelWithTip
      :text-label="dropdownLabel"
      :text-tip="tip"
    />
    <el-select
      v-model="value"
      placeholder="Select"
      @change="handleCurrentValue(value)"
    >
      <el-option
        v-for="item in this.$props.dropdownItems"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script>
import LabelWithTip from '../LabelWithTip/LabelWithTip.vue';

export default {
  name: 'DropdownContainer',
  components: { LabelWithTip },
  props: {
    dropdownLabel: {
      type: [String, Number],
      required: true,
    },
    defaultValue: {
      type: [String, Number],
      required: false,
      default: 0,
    },
    dropdownItems: {
      type: Array,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    tip: {
      type: String,
      required: false,
      default: 'Default tip',
    },
    dropdownKey: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      value: 0,
    };
  },
  mounted() {
    this.value = this.$props.defaultValue;
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'resetStore') this.value = this.$props.defaultValue;
    });
  },
  methods: {
    handleCurrentValue(value) {
      const parameter = this.$props.dropdownKey;
      this.$store.commit(this.$props.action, { parameter, value });
    },
  },
};
</script>

<style lang="sass">
@import './../../constants/variables.sass'

.el-select
  width: 100%

.el-select-dropdown__item.selected
  background: #FA9430
  color: white !important

.el-select-dropdown__item.hover
  background: #FEC47C
  color: white !important

.el-select-dropdown .popper__arrow
  display: none !important

.dropdown-container
  .label-with-tip
    font-size: 0.8750rem !important
    line-height: 1rem
    margin-bottom: 0

    .label
      font-family: "Roboto Regular", sans-serif !important
      color: black !important

.el-input__inner, .el-input, .el-select, .el-input__suffix-inner, .el-select__caret
  height: 2.500rem !important
  line-height: 2.5rem !important
</style>
