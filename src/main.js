import { createApp } from 'vue';
import store from '@/store';
import 'element-plus/lib/theme-chalk/index.css';
import { ElOption, ElSelect, ElTooltip } from 'element-plus';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faInfoCircle, faPause, faPlay, faRedoAlt, faStepForward,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './style.sass';
import App from './App.vue';

library.add(faInfoCircle);
library.add(faPause);
library.add(faPlay);
library.add(faRedoAlt);
library.add(faStepForward);

const app = createApp(App);
app.use(store);
app.component(ElOption.name, ElOption);
app.component(ElSelect.name, ElSelect);
app.component(ElTooltip.name, ElTooltip);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
