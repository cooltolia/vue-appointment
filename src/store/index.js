import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(Vuex);
Vue.use(VueAxios, axios);

function getaAvailableDates() {
    const today = new Date();
    let day1 = new Date();
    day1 = day1.setDate(day1.getDate() + 1);

    let day2 = new Date();
    day2 = day2.setDate(day2.getDate() + 2);

    let day3 = new Date();
    day3 = day3.setDate(day3.getDate() + 4);

    return [today, day1, day2, day3];
}

export default new Vuex.Store({
    state: {
        scrollbarWidth: 0,

        currentStep: 'specializationStep',
        currentSpecializationsType: null,

        specializationsTypes: [],
        currentSpecializationsType: {},
        specializationsList: [],
        branchesList: [],
        doctorsList: [],

        selectedSpecialization: null,
        selectedBranches: null,
        selectedBranch: null,
        selectedDoctor: null,

        selectedDate: '',
        selectedTime: '',

        allTimeSlotsData: null,
    },
    mutations: {
        setScrollbarWidth(state, value) {
            state.scrollbarWidth = value;
        },

        changeClientType(state, type) {
            state.clientType = type;
        },

        changeCurrentStep(state, step) {
            state.currentStep = step;
        },

        updateSpecializationsList(state, list) {
            state.specializationsList = list;
        },

        updateSpecializationsTypes(state, types) {
            types.map((type, i) => {
                if (i === 0) {
                    type.selected = true;
                    state.currentSpecializationsType = type;
                }
                return type;
            });

            state.specializationsTypes = types;
        },

        setActiveSpecializationsType(state, type) {
            state.specializationsTypes.map((el) => {
                el.selected = false;
                if (el.id === type.id) {
                    el.selected = true;
                    state.currentSpecializationsType = el;
                }
            });
        },

        updateBranchesList(state, list) {
            state.branchesList = list;
        },

        updateDoctorsList(state, list) {
            state.doctorsList = list;
        },

        updateSelectedSpecialization(state, item) {
            state.selectedSpecialization = item;
        },

        updateSelectedBranches(state, arr) {
            state.selectedBranches = arr;
        },

        updateSelectedBranch(state, value) {
            state.selectedBranch = value;
        },

        updateSelectedDoctor(state, doctor) {
            state.selectedDoctor = doctor;
        },

        updateSelectedDate(state, value) {
            state.selectedDate = value;
        },

        updateSelectedTime(state, value) {
            state.selectedTime = value;
        },

        updatAllTimeSlotsData(state, data) {
            state.allTimeSlotsData = data;
        },
    },
    actions: {
        loadInitialData({ commit }) {
            axios.get('http://mc21.glavnaya.com/app/ajax/order/types.php').then((response) => {
                commit('updateSpecializationsTypes', response.data.types);
                axios
                    .get(
                        'http://mc21.glavnaya.com/app/ajax/order/specializations.php?' +
                            'type=' +
                            response.data.types[0].id
                    )
                    .then((response) => {
                        commit('updateSpecializationsList', response.data.specializations);
                    });
            });
        },

        loadSpecializationsList({ commit }, { id }) {
            commit('updateSpecializationsList', []);
            commit('updateBranchesList', []);
            axios
                .get('http://mc21.glavnaya.com/app/ajax/order/specializations.php?' + 'type=' + id)
                .then((response) => {
                    commit('updateSpecializationsList', response.data.specializations);
                });
        },
        loadBranchesList({ commit }, { id }) {
            commit('updateBranchesList', []);
            axios
                .get(
                    'http://mc21.glavnaya.com/app/ajax/order/branches.php?' + 'specialization=' + id
                )
                .then((response) => {
                    commit('updateBranchesList', response.data.branches);
                });
        },

        loadDoctorsList({ commit, state }, name) {
            commit('updateDoctorsList', []);
            return new Promise((resolve) => {
                axios
                    .get(
                        'http://mc21.glavnaya.com/app/ajax/order/doctors.php?' +
                            'name=' +
                            name +
                            '&type=' +
                            state.currentSpecializationsType.id
                    )
                    .then((response) => {
                        if (!response.data.error) {
                            commit('updateDoctorsList', response.data.doctors);
                        }
                        resolve(response.data);
                    });
            });
        },

        submitSelectedDoctor({ commit }, id) {
            return new Promise((resolve) => {
                axios
                    .get('http://mc21.glavnaya.com/app/ajax/order/schedule.php?doctor=' + id)
                    .then((response) => {
                        commit('updatAllTimeSlotsData', response.data);
                        resolve(response.data);
                    });
            });
        },
        submitSpecilizationBranchData({ commit }, formData) {
            return new Promise((resolve) => {
                axios
                    .get(
                        `http://mc21.glavnaya.com/app/ajax/order/schedule.php?specialization=${formData.specialization}&branches=${formData.branches}`
                    )
                    .then((response) => {
                        commit('updatAllTimeSlotsData', response.data);
                        resolve(response.data);
                    });
            });
        },
    },
    modules: {},
});
