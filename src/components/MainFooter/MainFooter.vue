<template>
  <div id="footer">
    <div>©{{ new Date().getFullYear() }} Daitan Group</div>
    <span>This tool was built by João Pedro São Gregorio Silva (Developer)
      and Thalles Silva (Data Scientist) with the Innovation Team at Daitan.</span>
  </div>
</template>

<script>
import './style.sass';

export default {
  name: 'MainFooter',
};
</script>
