<template>
  <div id="footer">
    <div>©{{ new Date().getFullYear() }} Daitan Group</div>
    <span>Built by Innovation Team</span>
  </div>
</template>

<script>
export default {
  name: 'MainFooter',
};
</script>

<style lang="sass">
#footer
  background: #252D65
  width: 100%
  padding: 1rem 0
  text-align: center
  color: white
  font-size: 1em
  margin-top: 2.500rem

  span
    opacity: 0.8
    font-size: 0.8rem

  a:link, a:visited
    color: white

  a:hover
    text-shadow: 0 0 1px white
</style>
