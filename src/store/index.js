import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import http from '@/http';

const getDefaultState = () => {
    return {
        scrollbarWidth: 0,

        currentStep: 'specializationStep',
        initialFormStep: null,

        specializationsTypes: [],
        currentSpecializationsType: {},
        specializationsList: [],
        branchesList: [],
        doctorsList: [],

        selectedSpecialization: null,
        selectedBranches: null,
        selectedBranch: null,
        selectedDoctor: null,

        selectedService: null,

        selectedDate: '',
        selectedTime: '',

        allTimeSlotsData: null,

        privacyPolicy: '',
        modals: {
            error_network: 'Похоже, у вас пропало интернет-соединение',
        },
    };
};

const resetDefaultState = (state, ingnoreFields = []) => {
    const defaultState = getDefaultState();
    for (let key in defaultState) {
        if (ingnoreFields.indexOf(key) >= 0) return;
        state[key] = defaultState[key];
    }
}

export default new Vuex.Store({
    state: getDefaultState(),

    mutations: {
        resetState(state) {
            return resetDefaultState(state)
        },

        resetToFirstStep(state) {
            return resetDefaultState(state, ['specializationsTypes', 'currentSpecializationsTypes'])
        },

        setScrollbarWidth(state, value) {
            state.scrollbarWidth = value;
        },

        changeClientType(state, type) {
            state.clientType = type;
        },

        changeCurrentStep(state, step) {
            state.currentStep = step;
        },

        updateInitialFormStep(state, step) {
            state.initialFormStep = step
        },

        updateSpecializationsList(state, list) {
            state.specializationsList = list;
        },

        updateSpecializationsTypes(state, types) {
            types.map((type) => {
                if (type.active) state.currentSpecializationsType = type;
            });

            state.specializationsTypes = types;
        },

        setActiveSpecializationsType(state, type) {
            state.specializationsTypes.map((el) => {
                el.active = false;
                if (el.id === type.id) {
                    el.active = true;
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

        updateModalsContent(state, mistakes) {
            for (let key in mistakes) {
                state.modals[key] = mistakes[key];
            }
        },

        updateSelectedService(state, data) {
            state.selectedService = data;
        },
    },
    actions: {
        loadInitialData({ commit, state, dispatch }, reset = false) {
            /** first check the store */
            if (state.specializationsList.length > 0) return;

            const params = {
                service: window.service,
                specialization: window.specialization,
                doctor: window.doctor,
            };

            /** remove empty parameters */
            for (const key of Object.keys(params)) {
                if (!params[key] || params[key] === '') {
                    delete params[key];
                }
            }

            const query = !reset ? new URLSearchParams(params) : '';

            http.get(`/order/types.php?${query}`, { cache: false }).then((response) => {
                commit('updateSpecializationsTypes', response.data.types);
                http.get(`/order/subjects.php?type=${response.data.types[0].id}&${query}`, {
                    cache: false,
                }).then((response) => {
                    if (response.data.service) {
                        commit('updateSelectedService', response.data.service);
                        dispatch('loadBranchesList', { service: response.data.service });
                    } else if (response.data.doctor) {
                        commit('updateSelectedDoctor', response.data.doctor);
                        state.currentStep = 'nameStep';
                    } else {
                        if (response.data.specialization) {
                            commit('updateSelectedSpecialization', response.data.specialization);
                            dispatch('loadBranchesList', {
                                specialization: response.data.specialization,
                            });
                        }
                        commit('updateSpecializationsList', response.data.specializations);
                    }
                });
            });

            http.get('/order/info.php')
                .then((response) => {
                    commit('updatePrivacyPolicy', response.data.privacy_policy);
                    commit('updateModalsContent', response.data.modals);
                })
                .catch((e) => alert('Верните корсы(('));
        },

        loadSpecializationsList({ commit }, { id }, reset = false) {
            commit('updateSpecializationsList', []);
            commit('updateBranchesList', []);

            const params = {
                service: window.service,
                specialization: window.specialization,
                doctor: window.doctor,
            };

            /** remove empty parameters */
            for (const key of Object.keys(params)) {
                if (!params[key] || params[key] === '') {
                    delete params[key];
                }
            }

            const query = !reset ? new URLSearchParams(params) : '';

            http.get(`/order/subjects.php?type=${id}&${query}`).then((response) => {
                commit('updateSpecializationsList', response.data.specializations);
            });
        },

        loadBranchesList({ commit }, data) {
            commit('updateBranchesList', []);
            const key = Object.keys(data)[0];
            return new Promise((resolve) => {
                http.get(`/order/branches.php?${key}=${data[key].id}`).then((response) => {
                    commit('updateBranchesList', response.data.branches);
                    resolve(response.data.branches);
                });
            });
        },

        loadDoctorsList({ commit, state }, name) {
            commit('updateDoctorsList', []);
            return new Promise((resolve, reject) => {
                http.get(
                    '/order/doctors.php?' +
                        'name=' +
                        name +
                        '&type=' +
                        state.currentSpecializationsType.id
                ).then((response) => {
                    if (response.data.error) {
                        reject(response.data.error);
                    } else {
                        commit('updateDoctorsList', response.data.doctors);
                        resolve(response.data);
                    }
                });
            });
        },

        submitSelectedDoctor({ commit, state }, id) {
            return new Promise((resolve, reject) => {
                http.get(
                    `/order/schedule.php?doctor=${id}&type=${state.currentSpecializationsType.id}`
                ).then((response) => {
                    if (response.data.error) {
                        reject(response.data.error);
                    } else {
                        commit('updatAllTimeSlotsData', response.data);
                        resolve(response.data);
                    }
                });
            });
        },

        submitSpecilizationBranchData({ commit, state }, formData) {
            const params = formData;

            /** remove empty parameters */
            for (const key of Object.keys(params)) {
                if (!params[key] || params[key] === '') {
                    delete params[key];
                }
            }

            const query = new URLSearchParams(params);
            return new Promise((resolve, reject) => {
                http.get(
                    `/order/schedule.php${
                        Object.keys(params).length > 0 ? `?${query}&` : '?'
                    }type=${state.currentSpecializationsType.id}`
                )
                    .then((response) => {
                        if (response.data.error) {
                            reject(response.data.error);
                        } else {
                            commit('updatAllTimeSlotsData', response.data);
                            resolve(response.data);
                        }
                    })
                    .catch((e) => reject(e));
            });
        },

        resetToFirstStep({ state, commit, dispatch }) {
            commit('resetToFirstStep');
            dispatch('loadSpecializationsList', state.currentSpecializationsType);
        },

        resetToDefault({ commit, dispatch }) {
            commit('resetState');

            dispatch('loadInitialData', true);
        },
    },
    modules: {},
});
