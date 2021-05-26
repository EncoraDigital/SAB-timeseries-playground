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
        :visible-arrow="true"
      >
        <font-awesome-icon icon="info-circle" />
      </el-tooltip>
    </span>
  </div>
</template>

<script>
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

<style lang="sass">
.label
  font-family: 'Univia Pro Regular', sans-serif
  line-height: 1.8125em
  color: #19204E
  display: block
  overflow: visible
  white-space: nowrap

  .item
    color: #9FBFE0
    padding-bottom: 0.2em

.label-with-tip
  margin-bottom: 0.500rem

  img
    height: 100%

.tip
  font-family: "Roboto Regular", sans-serif
  font-size: 0.85em
  line-height: 1em

.icon-info
  height: auto
  margin-left: 0.3em

.el-tooltip__popper
  box-shadow: 0 0 0 1px #F3931B
  border: none !important
  font-family: "Roboto Regular", sans-serif
  font-size: 0.8em

.el-tooltip__popper.is-light[x-placement^=top] .popper__arrow
  border-top-color: #F3931B !important

.el-tooltip__popper.is-light[x-placement^=bottom] .popper__arrow
  border-bottom-color: #F3931B !important
</style>
