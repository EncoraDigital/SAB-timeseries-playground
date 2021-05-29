<template>
  <div>
    <TitleBar />
    <MenuBar />
  </div>
</template>

<script>

import TitleBar from '../TitleBar/TitleBar.vue';
import MenuBar from '../MenuBar/MenuBar.vue';

export default {
  name: 'MainHeader',
  components: { TitleBar, MenuBar },
};
</script>

<style>
</style>
