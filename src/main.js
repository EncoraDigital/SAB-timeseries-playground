import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faInfoCircle, faPause, faPlay, faRedoAlt, faStepForward,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {Select,Tooltip} from 'element-ui';
import { store } from './store';

import 'element-ui/lib/theme-chalk/index.css';

// Components
import App from './App';

// Styles
import './style.sass';

Vue.config.productionTip = false;
Vue.use(Select);
Vue.use(Tooltip);

// FontAwesome
Vue.component('font-awesome-icon', FontAwesomeIcon);

library.add(faPlay);
library.add(faRedoAlt);
library.add(faPause);
library.add(faStepForward);
library.add(faInfoCircle);
new Vue({
  store,
  render() {
    return (
            <App/>
    );
  },
}).$mount('#app');
