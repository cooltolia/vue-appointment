<template>
    <div class='wrapper'>
        <transition
            name="fade"
            mode='out-in'
        >
            <div
                class="loader"
                v-if='loader'
            >
                <div class="dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="text">{{ loaderText }}</div>
            </div>
        </transition>
        <div class='specialization-step'>
            <div class="selects">
                <template>
                    <div
                        class='input custom-input'
                        v-if="selectedService && selectedService.default"
                    >
                        <input
                            class="custom-input__input"
                            type="text"
                            readonly
                            name=""
                            :value="selectedService.name"
                            :title="selectedService.name"
                        >
                    </div>
                    <div
                        class="select"
                        v-if="specializations.length"
                    >
                        <custom-select
                            ref="specializationSelect"
                            :items="specializations"
                            :placeholder="'Выберите направление'"
                            :name="'appointment_specialization'"
                            :selected='selectedSpecializationName'
                            :options="{onSelect: onSpecializationSelect}"
                            :disabled="specializations.length === 0"
                            :key='selectedSpecializationName'
                        ></custom-select>
                    </div>
                </template>
                <template>
                    <div
                        class="select"
                        v-if="services.length"
                    >
                        <custom-select
                            ref="servicesSelect"
                            :items="services"
                            :placeholder="'Выберите услугу'"
                            :name="'appointment_services'"
                            :selected='selectedServiceName'
                            :options="{onSelect: onServiceSelect}"
                            :disabled="services.length === 0 || !selectedSpecializationName"
                        ></custom-select>
                    </div>
                    <div
                        class="select"
                        v-if="branches.length"
                    >
                        <custom-select
                            ref="branchesSelect"
                            :items="branches"
                            :placeholder="'Выберите филиал'"
                            :name="'appointment_branches'"
                            :options="{multiple: true, multipleCounterLabel: 'Выбрано филиалов', onSelect: onBranchSelect}"
                            :disabled="disableBranchesSelect"
                        ></custom-select>
                    </div>
                </template>
            </div>
            <div class="actions">
                <template>
                    <a
                        v-if="selectedService && selectedService.default"
                        href="#"
                        class="link bold"
                        @click.prevent='resetSelectedService'
                    >Другие услуги</a>
                    <a
                        v-else
                        href="#"
                        class="link bold"
                        @click.prevent="gotoNameStep"
                    >Найти врача по ФИО</a>
                </template>
                <a
                    href="#"
                    class="link"
                    @click.prevent="triggerCallback"
                    v-if='!noSubmitButton'
                >Заказать звонок коллцентра</a>
                <template>
                    <button
                        class='submit'
                        type="button"
                        :disabled='!formValid || preventSubmit'
                        @click.prevent="submit"
                        v-if='!noSubmitButton'
                    >Найти приемы</button>
                    <button
                        class="submit"
                        @click.prevent="triggerCallback($event, selectedSpecializationName)"
                        type="button"
                        v-if='noSubmitButton'
                    >Заказать звонок коллцентра</button>
                </template>

            </div>
        </div>

    </div>

</template>

<script>
    import CustomSelect from '@/components/CustomSelect.vue';
    import CallbackModal from '@/components/CallbackModal.vue';

    import { mapActions, mapMutations } from 'vuex';

    export default {
        name: 'SpecializationStep',
        components: {
            CustomSelect,
        },
        data() {
            return {
                selectedBranches: {},
                loader: false,
                loaderTextArray: [
                    { text: 'Ищем подходящие приемы', delay: 5000 },
                    { text: 'Проверили почти все филиалы', delay: 7000 },
                    { text: 'Осталась пара секунд', delay: 8000 },
                ],
                loaderText: '',
                noSubmitButton: false,
                preventSubmit: false,
            };
        },
        computed: {
            formValid() {
                if (
                    (!!this.selectedSpecializationName || this.selectedService?.default) &&
                    Object.keys(this.selectedBranches).length > 0
                ) {
                    return true;
                } else {
                    return false;
                }
                return (
                    (!!this.selectedSpecializationName || !!this.selectedServiceName) &&
                    !!Object.keys(this.selectedBranches).length > 0
                );
            },
            disableBranchesSelect() {
                if (
                    this.services?.length &&
                    this.selectedServiceName &&
                    this.selectedSpecializationName
                )
                    return false;
                if (!this.services?.length && this.selectedSpecializationName) return false;
                if (!this.services?.length && this.selectedServiceName) return false;
                return true;
            },
            specializations() {
                return this.$store.state.specializationsList;
            },
            branches() {
                return this.$store.state.branchesList;
            },
            services() {
                return this.$store.state.servicesList;
            },
            selectedService() {
                return this.$store.state.selectedService;
            },
            selectedSpecializationName() {
                console.log(this.$store.state.selectedSpecialization);
                return this.$store.state.selectedSpecialization?.name;
            },
            selectedServiceName() {
                return this.$store.state.selectedService?.name;
            },
        },
        methods: {
            ...mapMutations([
                'updateSelectedSpecialization',
                'updateSelectedBranches',
                'updateBranchesList',
                'updateServicesList',
                'updateSelectedBranch',
                'changeCurrentStep',
                'updateSelectedDoctor',
                'updateSelectedService',
                'updateInitialFormStep',
                'resetState',
            ]),
            ...mapActions([
                'loadBranchesList',
                'loadServicesList',
                'submitSpecilizationBranchData',
                'loadSpecializationsList',
            ]),
            onSpecializationSelect(item) {
                const selectedSpecialization = { name: item.value, id: item.id };
                this.noSubmitButton = false;

                this.updateBranchesList([]);
                this.updateServicesList([]);
                this.selectedBranches = {};

                item.disabled = this.specializations[item.index].disabled;
                item.services = this.specializations[item.index].services;

                if (item.disabled) {
                    this.noSubmitButton = true;
                } else if (item.services) {
                    this.loadServicesList({ specialization: item });
                } else {
                    this.loadBranchesList({ specialization: item });
                }

                this.updateSelectedSpecialization(selectedSpecialization);
                if (this.$refs.branchesSelect) {
                    this.$refs.branchesSelect.select.clearSelected();
                }
            },
            onServiceSelect(item) {
                this.updateSelectedService({ name: item.value, id: item.id });
                this.updateBranchesList([]);
                this.selectedBranches = {};

                this.loadBranchesList({ service: item });

                if (this.$refs.branchesSelect) {
                    this.$refs.branchesSelect.select.clearSelected();
                }
            },
            onBranchSelect(selectedValue) {
                if (selectedValue.toggleAll) {
                    if (selectedValue.action === 'add') {
                        this.branches.map((el) => {
                            this.$set(this.selectedBranches, el.id, { value: el.name, id: el.id });
                        });
                    } else {
                        this.branches.map((el) => {
                            this.selectedBranches = {};
                        });
                    }
                } else {
                    if (selectedValue.action === 'add') {
                        this.$set(this.selectedBranches, selectedValue.id, selectedValue);
                    } else {
                        this.$delete(this.selectedBranches, selectedValue.id);
                    }
                }

                this.updateSelectedBranches(this.selectedBranches);
            },
            triggerCallback($event, specialization = null) {
                const vm = this;
                console.log(specialization);

                this.$modal.show(
                    CallbackModal,
                    { specialization },
                    {
                        adaptive: true,
                        width: '90%',
                        maxWidth: 686,
                        height: 'auto',
                        scrollable: true,
                        minHeight: Infinity,
                    },
                    {
                        'before-open': (event) => {
                            document.body.style.overflow = 'hidden';
                            document.body.style.paddingRight = vm.$store.state.scrollbarWidth + 'px';
                        },
                        closed: (event) => {
                            document.body.style.overflow = null;
                            document.body.style.paddingRight = null;
                        },
                    }
                );
            },
            submit() {
                this.preventSubmit = true;

                const formData = {
                    specialization: this.$store.state.selectedSpecialization?.id,
                    service: this.selectedService ? this.selectedService.id : null,
                    branches: Object.keys(this.selectedBranches),
                };
                console.log(formData);

                this.loader = true;
                this.updateLoaderText();

                this.submitSpecilizationBranchData(formData)
                    .then(() => {
                        this.updateInitialFormStep('specializationStep');
                        this.changeCurrentStep('timeStep');
                    })
                    .finally(() => {
                        this.stopLoaderText();
                        this.loader = false;
                        this.loaderText = '';

                        this.preventSubmit = false;
                    });
            },

            updateLoaderText(array = null) {
                array = array || [...this.loaderTextArray];
                const item = array.shift();
                console.log(item);

                if (!item) {
                    this.stopLoaderText();
                    return;
                }

                this._setTimeout = setTimeout(() => {
                    this.loaderText = item.text;
                    this.updateLoaderText(array);
                }, item.delay);
            },

            stopLoaderText() {
                clearTimeout(this._setTimeout);
            },

            resetSelectedService() {
                this.resetState();
                this.$refs.branchesSelect.select.clearSelected();

                window.service = null; // should have been done better

                this.$store.dispatch('loadInitialData', true);
            },

            gotoNameStep() {
                window.specialization = null;
                this.$store.commit('changeCurrentStep', 'nameStep');
            },
        },
        mounted() {
            // this.updateBranchesList([]);
            this.selectedBranches = {};
            this.updateSelectedBranches(null);

            // if (!this.selectedService && this.$store.state.currentStep === 'specializationStep') {
            //     console.log('ooops');debugger;
            //     console.log(this.$store.state.currentSpecializationsType);
            //     // this.loadSpecializationsList(this.$store.state.currentSpecializationsType);
            // }

            this.$root.$on('typeUpdate', (e) => {
                // console.log('clear all');
                this.selectedBranches = {};
                // this.updateSelectedBranches(null);
                this.updateSelectedBranches(null);
                this.updateSelectedSpecialization(null);
                this.updateSelectedService(null);
                // this.updateSelectedService(null);
                // this.updateServicesList([])
                // window.specialization = null;
                if (!this.selectedService && this.$store.state.currentStep === 'specializationStep') {
                    this.loadSpecializationsList(this.$store.state.currentSpecializationsType);
                }
            });
        },

        destroyed() {
            this.$root.$off('typeUpdate');
        },
    };
</script>

<style lang='scss' scoped>
    @import '@/scss/custom-input.scss';

    .wrapper {
        position: relative;
    }

    .loader {
        position: absolute;
        z-index: 99;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        align-items: center;

        background-color: rgba(#fff, 0.9);

        .dots {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dot {
            width: 10px;
            height: 10px;
            margin-right: 10px;

            background-color: #eee;
            border-radius: 50%;

            animation: loaderBounce 2s ease infinite;

            &:nth-child(2) {
                animation-delay: 0.5s;
            }

            &:nth-child(3) {
                animation-delay: 1s;
            }

            &:nth-child(4) {
                animation-delay: 1.5s;
            }

            &:last-child {
                margin-right: 0;
            }
        }

        .text {
            position: absolute;
            left: 50%;
            bottom: 12px;
            transform: translateX(-50%);

            font-size: 16px;
            text-align: center;
        }
    }

    @keyframes loaderBounce {
        from,
        to {
            background-color: #eee;
        }

        50% {
            background-color: $green;
        }
    }

    .specialization-step {
        max-width: 695px;
        margin: 0 auto;

        .selects {
            display: flex;
            flex-flow: row nowrap;
            margin: 0 -8px 16px;
            min-height: 50px;
        }

        .select,
        .input {
            width: 30%;
            flex: 1 1 auto;
            margin: 0 8px;
        }

        .input input {
        }

        .actions {
            display: flex;
            align-items: center;
        }

        .link {
            margin-right: 24px;

            font-size: 14px;
            color: $text-color;
            font-weight: 400;

            transition: opacity 300ms ease;

            &.bold {
                font-weight: 600;
                text-decoration: underline;
            }

            &:hover,
            &:active,
            &:focus {
                opacity: 0.6;
            }
        }

        .submit {
            flex: 0 0 auto;
            padding: 13px 24px 13px;
            min-width: 255px;
            margin-left: auto;

            color: $text-color-white;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;

            background-color: $green;
            border: 2px solid $green;
            box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);

            outline: none;

            transition-duration: 300ms;
            transition-timing-function: ease-in-out;
            transition-property: color, background-color, border-color, opacity;

            &:hover,
            &:active,
            &:focus {
                color: $text-color;

                background-color: #fff;
            }

            &.disabled,
            &:disabled {
                opacity: 0.5;
                cursor: initial;

                pointer-events: none;

                &:hover,
                &:active,
                &:focus {
                    opacity: 0.5;
                    text-decoration: none;
                }
            }
        }

        @media (max-width: 768px) {
            .selects {
                display: block;
                margin: 0;
            }

            .select,
            .input {
                width: 100%;
                margin: 0 0 16px;
            }

            .actions {
                display: block;
            }

            .link {
                display: inline-block;
                margin-bottom: 8px;
            }

            .submit {
                min-width: 160px;
                margin-top: 16px;
            }
        }
    }
</style>
