<template>
  <div class="title-bar-container">
    <img
      alt="Logo"
      class="logo"
      src="@/assets/logo.png"
    >
    <div class="line" />
    <span class="title">Time Series Playground</span>
  </div>
</template>

<script>
export default {
  name: 'TitleBar',
};
</script>

<style lang="sass">
.title-bar-container
  background: #252D65
  height: 5rem
  display: flex
  flex-direction: row
  align-Items: center

.logo
  margin-left: 32px

.title
  font-family: Univia Pro Ultra Light, sans-serif
  font-size: 1.5em
  color: white
  line-height: 29px

.line
  align-self: center
  height: 20px
  border-left: 1px white solid
  margin-right: 24px
  margin-left: 14px

</style>
