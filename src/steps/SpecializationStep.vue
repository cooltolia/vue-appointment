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
                        v-if="selectedService"
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
                        v-else
                    >
                        <custom-select
                            ref="specializationSelect"
                            :items="specializations"
                            :placeholder="'Выберите направление'"
                            :name="'appointment_specialization'"
                            :selected='selectedSpecializationName'
                            :options="{onSelect: onSpecializationSelect}"
                            :disabled="specializations.length === 0"
                        ></custom-select>
                    </div>
                </template>
                <div class="select">
                    <custom-select
                        ref="branchesSelect"
                        :items="branches"
                        :placeholder="'Выберите филиал'"
                        :name="'appointment_branches'"
                        :options="{multiple: true, multipleCounterLabel: 'Выбрано филиалов', onSelect: onBranchSelect}"
                        :disabled="branches.length === 0 || (!selectedSpecializationName && !selectedService)"
                    ></custom-select>
                </div>

            </div>
            <div class="actions">
                <template>
                    <a
                        v-if="selectedService"
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
                >Заказать звонок коллцентра</a>
                <button
                    class='submit'
                    type="button"
                    :disabled='!formValid || preventSubmit'
                    @click.prevent="submit"
                >Найти приемы</button>
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
                selectedSpecialization: this.$store.state.selectedSpecialization,
                selectedBranches: {},
                loader: false,
                loaderTextArray: [
                    { text: 'Ищем подходящие приемы', delay: 5000 },
                    { text: 'Проверили почти все филиалы', delay: 7000 },
                    { text: 'Осталась пара секунд', delay: 8000 },
                ],
                loaderText: '',

                preventSubmit: false,
            };
        },
        computed: {
            formValid() {
                return (
                    (!!this.selectedSpecializationName || !!this.selectedService) &&
                    !!Object.keys(this.selectedBranches).length > 0
                );
            },
            specializations() {
                return this.$store.state.specializationsList;
            },
            branches() {
                return this.$store.state.branchesList;
            },
            selectedService() {
                return this.$store.state.selectedService;
            },
            selectedSpecializationName() {
                return this.$store.state.selectedSpecialization?.name;
            },
        },
        methods: {
            ...mapMutations([
                'updateSelectedSpecialization',
                'updateSelectedBranches',
                'updateSelectedBranch',
                'changeCurrentStep',
                'updateSelectedDoctor',
                'updateSelectedService',
                'updateInitialFormStep',
                'resetState',
            ]),
            ...mapActions([
                'loadBranchesList',
                'submitSpecilizationBranchData',
                'loadSpecializationsList',
            ]),
            onSpecializationSelect(item) {
                this.selectedSpecialization = { name: item.value, id: item.id };

                this.loadBranchesList({ specialization: item });
                this.updateSelectedSpecialization(this.selectedSpecialization);
                this.$refs.branchesSelect.select.clearSelected();
            },
            onBranchSelect(selectedValue) {
                if (selectedValue.action === 'add') {
                    this.$set(this.selectedBranches, selectedValue.id, selectedValue);
                } else {
                    this.$delete(this.selectedBranches, selectedValue.id);
                }

                console.log(this.selectedBranches);

                this.updateSelectedBranches(this.selectedBranches);
            },
            triggerCallback() {
                const vm = this;

                this.$modal.show(
                    CallbackModal,
                    {},
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

                this.loader = true;
                this.updateLoaderText();

                this.submitSpecilizationBranchData(formData)
                    .then(() => {
                        this.updateInitialFormStep('specializationStep')
                        this.changeCurrentStep('timeStep');
                    })
                    .finally(() => {
                        this.stopLoaderText();
                        this.loader = false;
                        this.loaderText = '';

                        this.preventSubmit = false
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
            this.$root.$on('typeUpdate', (e) => {
                this.selectedBranches = {};
                this.updateSelectedBranches(null);
                window.specialization = null;

                if (!this.selectedService && this.$store.state.currentStep === 'specializationStep') {
                    this.loadSpecializationsList(this.$store.state.currentSpecializationsType);
                    console.log(this.$store.state.currentSpecializationsType);
                    this.updateSelectedSpecialization(null);
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
        z-index: 2;
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
        }

        .select,
        .input {
            width: 40%;
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

            .select {
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
