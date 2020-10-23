import Vue from 'vue';
import App from './App.vue';
import store from './store';

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

import VCalendar from 'v-calendar';
Vue.use(VCalendar, {
    masks: { weekdays: 'WW' },
});

import VModal from 'vue-js-modal';
Vue.use(VModal);

import VueTheMask from 'vue-the-mask';
Vue.use(VueTheMask);

import 'simplebar/dist/simplebar.css';

Vue.config.productionTip = false;

window.vm = new Vue({
    store,
    render: (h) => h(App),
}).$mount('#onlineAppointment');
