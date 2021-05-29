<template>
  <div class="wrapper">
    <MainHeader/>
    <MainContent/>
    <TextDescription/>
    <MainFooter/>
  </div>
</template>

<script>
// Components
import MainHeader from './components/MainHeader/MainHeader.vue';
import MainContent from './components/MainContent/MainContent.vue';
import TextDescription from './components/TextDescription/TextDescription.vue';
import MainFooter from './components/MainFooter/MainFooter.vue';

export default {
  name: 'App',
  components: {
    MainHeader,
    MainContent,
    TextDescription,
    MainFooter,
  },
};
</script>
