<template>
  <div
    :style="customStyle"
    class="label-with-tip"
  >
    <span class="label">
      {{ this.$props.textLabel }}
      <el-tooltip
        v-if="textTip"
        :content="textTip"
        class="item"
        effect="light"
        placement="top"
        visible-arrow="true"
      >
        <font-awesome-icon icon="info-circle" />
      </el-tooltip>
    </span>
  </div>
</template>

<script>
import './style.sass';

export default {
  name: 'LabelWithTip',
  components: {},
  props: {
    textLabel: {
      type: String,
      required: true,
    },
    textTip: {
      type: [String, Boolean],
      required: false,
      default: 'No tip',
    },

    customStyle: {
      type: Object,
      required: false,
      default() {
        return { fontSize: '1.45em' };
      },
    },
  },

};
</script>
