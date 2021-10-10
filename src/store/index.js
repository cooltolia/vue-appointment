import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import http from '@/http';
import { postData } from '@/common/ajax';

const getDefaultState = () => {
    return {
        scrollbarWidth: 0,

        currentStep: 'specializationStep',
        initialFormStep: null,

        specializationsTypes: [],
        currentSpecializationsType: {},
        specializationsList: [],
        branchesList: [],
        servicesList: [],
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

const resetDefaultState = (ignoreFields = []) => {
    const defaultState = getDefaultState();
    // for (let key in defaultState) {
    //     if (ingnoreFields.indexOf(key) >= 0) return;
    //     state[key] = defaultState[key];
    // }
    ignoreFields.forEach((field) => delete defaultState[field]);
    return defaultState;
};

export default new Vuex.Store({
    state: getDefaultState(),

    mutations: {
        resetState(state) {
            Object.assign(state, resetDefaultState());
        },

        resetToFirstStep(state) {
            Object.assign(
                state,
                resetDefaultState(['specializationsTypes', 'currentSpecializationsType'])
            );
            // return resetDefaultState(state, [
            //     'specializationsTypes',
            //     'currentSpecializationsTypes',
            // ]);
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
            state.initialFormStep = step;
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

        updateServicesList(state, list) {
            state.servicesList = list;
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

        updateSelectedService(state, item) {
            state.selectedService = item;
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
        fireCaptcha() {
            // return new Promise((resolve) => resolve(''));
            return new Promise((resolve) => {
                grecaptcha.ready(function() {
                    grecaptcha
                        .execute('6LdDp8gaAAAAAGwy86x68-rkIgkHVfLQcK1_Xy1x', {
                            action: 'calculation',
                        })
                        .then(function(token) {
                            resolve(token);
                        });
                });
            });
        },

        loadInitialData({ commit, state, dispatch }, reset = false) {
            /** first check the store */
            if (state.specializationsList.length > 0) return;

            const params = {
                service: window.service,
                specialization: window.specialization,
                doctor: window.doctor,
                type: window.type,
            };

            /** remove empty parameters */
            for (const key of Object.keys(params)) {
                if (!params[key] || params[key] === '') {
                    delete params[key];
                }
            }

            const postData = !reset ? new formDataFromObject(params) : new FormData();

            http.post('/order/types.php', postData, { cache: false }).then((response) => {
                commit('updateSpecializationsTypes', response.data.types);
                postData.append('type', response.data.types[0].id);
                http.post('/order/subjects.php', postData, {
                    cache: false,
                }).then((response) => {
                    if (response.data.service) {
                        commit('updateSelectedService', response.data.service);
                        dispatch('loadBranchesList', { service: response.data.service });
                    } else if (response.data.doctor) {
                        state.currentStep = 'nameStep';
                        console.log('set');
                        commit('updateSelectedDoctor', response.data.doctor);
                    } else {
                        if (response.data.specialization) {
                            commit('updateSelectedSpecialization', response.data.specialization);
                            if (response.data.specialization.services) {
                                dispatch('loadServicesList', {
                                    specialization: response.data.specialization,
                                });
                            }
                            dispatch('loadBranchesList', {
                                specialization: response.data.specialization,
                            });
                        }
                        commit('updateSpecializationsList', response.data.specializations);
                    }
                });
            });

            http.post('/order/info.php')
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

            const postData = !reset ? formDataFromObject(params) : new FormData();
            postData.append('type', id);

            http.post('/order/subjects.php', postData).then((response) => {
                commit('updateSpecializationsList', response.data.specializations);
            });
        },

        loadBranchesList({ commit }, data) {
            commit('updateBranchesList', []);
            const key = Object.keys(data)[0];
            const postData = new FormData();
            postData.append(key, data[key].id);

            return new Promise((resolve) => {
                http.post('/order/branches.php', postData).then((response) => {
                    commit('updateBranchesList', response.data.branches);
                    resolve(response.data.branches);
                });
            });
        },

        loadServicesList({ commit, state }, data) {
            commit('updateServicesList', []);
            const key = Object.keys(data)[0];
            const postData = new FormData();
            postData.append(key, data[key].id);
            postData.append('type', state.currentSpecializationsType.id);

            return new Promise((resolve) => {
                http.post('/order/services.php', postData).then((response) => {
                    commit('updateServicesList', response.data.services);
                    resolve(response.data.services);
                });
            });
        },

        loadDoctorsList({ commit, state }, name) {
            commit('updateDoctorsList', []);
            const postData = new FormData();
            postData.append('name', name);
            postData.append('type', state.currentSpecializationsType.id);
            return new Promise((resolve, reject) => {
                http.post('/order/doctors.php', postData).then((response) => {
                    if (response.data.error) {
                        reject(response.data.error);
                    } else {
                        commit('updateDoctorsList', response.data.doctors);
                        resolve(response.data);
                    }
                });
            });
        },

        submitSelectedDoctor({ commit, state, dispatch }, id) {
            return new Promise((resolve, reject) => {
                dispatch('fireCaptcha').then((token) => {
                    const formData = new FormData();
                    formData.append('doctor', id);
                    formData.append('type', state.currentSpecializationsType.id);
                    formData.append('recaptcha', token);

                    http.post('/order/schedule.php?', formData).then((response) => {
                        if (response.data.error) {
                            reject(response.data.error);
                        } else {
                            commit('updatAllTimeSlotsData', response.data);
                            resolve(response.data);
                        }
                    });
                });
            });
        },

        submitSpecilizationBranchData({ commit, state, dispatch }, data) {
            const params = data;

            /** remove empty parameters */
            for (const key of Object.keys(params)) {
                if (!params[key] || params[key] === '') {
                    delete params[key];
                }
            }

            const formData = formDataFromObject(params);

            formData.append('type', state.currentSpecializationsType.id);

            return new Promise((resolve, reject) => {
                dispatch('fireCaptcha').then((token) => {
                    formData.append('recaptcha', token);
                    http.post('/order/schedule.php', formData)
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

/** @returns {FormData} */
function formDataFromObject(data) {
    const formData = new FormData();

    for (let key in data) {
        formData.append(key, data[key]);
    }

    return formData;
}
