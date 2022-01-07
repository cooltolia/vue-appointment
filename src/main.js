import Vue from 'vue';
import App from './App.vue';
import store from './store';

import VCalendar from 'v-calendar';
Vue.use(VCalendar, {
    masks: { weekdays: 'WW' },
});

import VModal from 'vue-js-modal';
Vue.use(VModal);

const VueInputMask = require('vue-inputmask').default;
Vue.use(VueInputMask);

const VueScrollTo = require('vue-scrollto');
Vue.use(VueScrollTo);

import 'simplebar/dist/simplebar.css';

import YmapPlugin from 'vue-yandex-maps';
Vue.use(YmapPlugin, {
    apiKey: 'c1ebd1aa-95d9-4731-bfdc-69025a81c336',
    lang: 'ru_RU',
    coordorder: 'latlong',
    version: '2.1',
});

Vue.config.productionTip = false;

window.onlineAppointmentInstance = new Vue({
    store,
    render: (h) => h(App),
}).$mount('#onlineAppointment');

window.reinitOnlineAppointment = (vm, cb) => {
    vm.$destroy();
    const parent = document.querySelector('#onlineAppointment');
    const parentClone = parent.cloneNode();
    parent.replaceWith(parentClone);

    window.doctor = null;
    window.service = null;
    window.specialization = null;

    store.commit('resetState');

    if (typeof cb === 'function') {
        cb();
    }

    window.onlineAppointmentInstance = new Vue({
        store,
        render: (h) => h(App),
    }).$mount('#onlineAppointment');
};
