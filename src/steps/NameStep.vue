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
        <div class="first-step name-step">
            <div class="input">
                <span
                    class="input-error"
                    v-if="empty"
                >Врачи не найдены</span>
                <input
                    type="text"
                    name="doctor"
                    placeholder="Введите ФИО врача"
                    v-model="doctorName"
                    autocomplete="off"
                    :readonly="loading"
                >
                <transition name="fade">
                    <div
                        class="dropdown"
                        aria-expanded="false"
                        v-show="showList"
                        ref="doctorsDropdown"
                    >
                        <ul class='list'>
                            <li
                                v-for='doctor in doctors'
                                :key="doctor.id"
                                class="item"
                                tabindex="0"
                                @click="selectDoctor(doctor)"
                            >
                                <span class='name'>
                                    {{ doctor.name }}
                                </span>
                                <span class="profession">
                                    {{ doctor.position }}
                                </span>
                            </li>
                        </ul>

                    </div>
                </transition>
            </div>
            <div class="actions">
                <a
                    href="#"
                    class="link bold"
                    @click.prevent="gotoSpecialization"
                >Найти по специализации</a>
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
    import { mapActions, mapMutations } from 'vuex';
    import SimpleBar from 'simplebar';
    import { debounce } from '@/common/helpers';
    import CallbackModal from '@/components/CallbackModal.vue';

    export default {
        name: 'NameStep',
        data() {
            return {
                doctorName: this.$store.state.selectedDoctor?.name || '',
                doctorID: this.$store.state.selectedDoctor?.id || null,
                doctors: [],

                loader: false,
                loaderTextArray: [
                    { text: 'Ищем подходящие приемы', delay: 5000 },
                    { text: 'Проверили почти все филиалы', delay: 7000 },
                    { text: 'Осталась пара секунд', delay: 8000 },
                ],
                loaderText: '',

                showList: false,
                loading: false,
                preventLoading: false,
                preventSubmit: false,
                empty: false,
            };
        },
        watch: {
            doctorName(newValue, oldValue) {
                this.showList = false;

                if (!this.preventLoading) {
                    this.doctorID = null;
                    this.debouncedGetData(newValue);
                }

                this.preventLoading = false;
            },
        },
        computed: {
            formValid() {
                return this.doctorName.length > 0 && this.doctorID !== null;
            },
        },
        methods: {
            ...mapMutations([
                'updateSelectedDoctor',
                'updateDoctorsList',
                'updateSelectedSpecialization',
                'updateSelectedBranches',
                'updateSelectedBranch',
                'changeCurrentStep',
                'updateInitialFormStep',
                'resetState',
            ]),
            ...mapActions(['loadDoctorsList', 'submitSelectedDoctor']),

            gotoSpecialization() {
                this.resetState();

                window.doctor = null;

                this.$store.dispatch('loadInitialData', true);
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
                        'before-close': (event) => {
                            document.body.style.overflow = null;
                            document.body.style.paddingRight = null;
                        },
                    }
                );
            },
            selectDoctor(doctor) {
                this.doctorName = doctor.name;
                this.doctorID = doctor.id;

                this.showList = false;
                this.preventLoading = true;

                this.updateSelectedDoctor(doctor);
            },
            submit() {
                this.preventSubmit = true;

                this.loader = true;
                this.updateLoaderText();

                this.submitSelectedDoctor(this.doctorID)
                    .then((data) => {
                        this.updateInitialFormStep('nameStep');
                        this.changeCurrentStep('timeStep');
                    })
                    .catch((e) => {
                        this.preventSubmit = false;
                        this.updateSelectedDoctor(null);
                        this.doctorName = '';
                        this.doctorID = null;
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

            getData(val) {
                this.empty = false;
                if (val.length <= 2 || this.loading || this.preventLoading) return;

                this.loading = true;
                this.loadDoctorsList(val)
                    .then((data) => {
                        this.loading = false;
                        if (data.empty) {
                            this.empty = true;
                        } else if (data.doctors) {
                            this.doctors = data.doctors;
                            this.showList = true;
                        }
                    })
                    .catch((e) => {
                        this.loading = false;
                    });
            },
        },
        mounted() {
            this.debouncedGetData = debounce(this.getData, 500);

            this.updateSelectedSpecialization(null);
            this.updateSelectedBranches(null);
            this.updateSelectedBranch(null);

            // this.updateSelectedDoctor(null);

            // this.doctorName = '';
            // this.doctorID = null;

            this.$root.$on('typeUpdate', (e) => {
                this.updateSelectedDoctor(null);

                this.doctorName = '';
                this.doctorID = null;
            });

            new SimpleBar(this.$refs.doctorsDropdown);
        },

        destroyed() {
            this.$root.$off('typeUpdate');
        },
    };
</script>

<style lang='scss' scoped>
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

    .first-step {
        max-width: 695px;
        margin: 0 auto;

        .input {
            position: relative;
            margin-bottom: 16px;

            input {
                display: block;
                width: 100%;
                padding: 0 20px;
                height: 50px;

                color: $text-color;
                font-size: 15px;
                line-height: 50px;

                background-color: $bg;
                border: 1px solid #f0f0f0;
                outline: none;
                appearance: none;

                transition: border-color 300ms ease;

                &::placeholder {
                    color: $text-color-light;
                }

                &:focus {
                    border-color: $text-color;
                }

                &:read-only {
                    border-color: transparent;
                }

                &:disabled {
                    opacity: 0.5;
                }
            }
        }

        .input-error {
            position: absolute;
            top: 0;
            left: 0;
            transform: translateY(-110%);

            font-size: 14px;
            color: $accent-color;
        }

        .dropdown {
            position: absolute;
            z-index: 9;
            width: 100%;
            max-width: 320px;
            height: auto;
            max-height: 320px;

            transform: translateY(8px);

            background-color: #ffffff;
            box-shadow: 0px 100px 200px rgba(0, 0, 0, 0.25);

            /deep/ .simplebar-track.simplebar-vertical {
                right: 8px;
                top: 20px;
                bottom: 20px;
            }
        }

        .list {
            margin: 0;
            padding: 20px 30px;

            list-style: none;
        }

        .item {
            padding: 15px 0;

            color: $text-color;
            font-size: 16px;

            transition: opacity 300ms ease;

            outline: none;
            cursor: pointer;

            &:hover,
            &:active,
            &:focus {
                opacity: 0.6;
            }

            &:focus {
                .name {
                    text-decoration: none;
                }
            }
        }
        .name {
            text-decoration: underline;
        }

        .profession {
            display: block;
            margin-top: 4px;

            font-size: 12px;
            font-weight: 300;
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

        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.5s;
        }
        .fade-enter,
        .fade-leave-to {
            opacity: 0;
        }

        @media (max-width: 768px) {
            .actions {
                display: block;
            }

            .link {
                display: inline-block;
                margin-bottom: 8px;
            }

            .submit {
                margin-top: 16px;
            }
        }
    }
</style>
