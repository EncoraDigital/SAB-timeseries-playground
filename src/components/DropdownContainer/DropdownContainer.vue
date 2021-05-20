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
import './style.sass';
import LabelWithTip from '../LabelWithTip/LabelWithTip';

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

<style>
</style>
