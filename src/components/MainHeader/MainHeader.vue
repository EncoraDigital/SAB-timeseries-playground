<template>
  <div>
    <TitleBar />
    <MenuBar />
  </div>
</template>

<script>

import TitleBar from '../TitleBar/TitleBar';
import MenuBar from '../MenuBar/MenuBar';

export default {
  name: 'MainHeader',
  components: { TitleBar, MenuBar },
};
</script>

<style>
</style>
