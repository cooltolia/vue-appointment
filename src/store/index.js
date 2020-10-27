import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import http from '@/http';

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

        privacyPolicy: '',
        modals: {}
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

        updatePrivacyPolicy(state, data) {
            state.privacyPolicy = data;
        },

        updateModalsContent(state, {success, error, error_order}) {
            state.modals.success = success;
            state.modals.error = error;
            state.modals.error_order = error_order;
        }
    },
    actions: {
        loadInitialData({ commit, state }) {
            /** first check the store */
            if (state.specializationsList.length > 0) return;

            http.get('/types.php').then((response) => {
                commit('updateSpecializationsTypes', response.data.types);
                http.get('/specializations.php?' + 'type=' + response.data.types[0].id).then(
                    (response) => {
                        commit('updateSpecializationsList', response.data.specializations);
                    }
                );
            });

            http.get('/info.php').then((response) => {
                commit('updatePrivacyPolicy', response.data.privacy_policy);
                commit('updateModalsContent', response.data);
            });
        },

        loadSpecializationsList({ commit }, { id }) {
            commit('updateSpecializationsList', []);
            commit('updateBranchesList', []);
            http.get('/specializations.php?' + 'type=' + id).then((response) => {
                commit('updateSpecializationsList', response.data.specializations);
            });
        },
        loadBranchesList({ commit }, { id }) {
            commit('updateBranchesList', []);
            return new Promise((resolve) => {
                http.get('/branches.php?' + 'specialization=' + id).then((response) => {
                    commit('updateBranchesList', response.data.branches);
                    resolve(response.data.branches);
                });
            });
        },

        loadDoctorsList({ commit, state }, name) {
            commit('updateDoctorsList', []);
            return new Promise((resolve) => {
                http.get(
                    '/doctors.php?' +
                        'name=' +
                        name +
                        '&type=' +
                        state.currentSpecializationsType.id
                ).then((response) => {
                    if (!response.data.error) {
                        commit('updateDoctorsList', response.data.doctors);
                    }
                    resolve(response.data);
                });
            });
        },

        submitSelectedDoctor({ commit }, id) {
            return new Promise((resolve) => {
                http.get('/schedule.php?doctor=' + id).then((response) => {
                    commit('updatAllTimeSlotsData', response.data);
                    resolve(response.data);
                });
            });
        },
        submitSpecilizationBranchData({ commit }, formData) {
            return new Promise((resolve) => {
                http.get(
                    `/schedule.php?specialization=${formData.specialization}&branches=${formData.branches}`
                ).then((response) => {
                    commit('updatAllTimeSlotsData', response.data);
                    resolve(response.data);
                });
            });
        },
    },
    modules: {},
});
