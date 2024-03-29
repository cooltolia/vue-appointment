<template>
    <div class="form-step">
        <div class="wrapper">
            <div class="title">
                {{ title }}
            </div>
            <div class="info">
                <div class='info-row'>
                    <div class="info-title">Врач:</div>
                    <div class="info-value">{{ selectedDoctor.name }}</div>
                    <a
                        class="info-link"
                        href="#"
                        @click.prevent="returnBack('nameStep')"
                    >Сменить
                    </a>
                </div>
                <div class='info-row'>
                    <div class="info-title">Адрес:</div>
                    <div class="info-value">{{ selectedBranch.value }}</div>
                    <a
                        class="info-link"
                        href="#"
                        @click.prevent="returnBack('specializationStep')"
                    >Сменить
                    </a>
                </div>
                <div class='info-row'>
                    <div class="info-title">Дата:</div>
                    <div class="info-value">{{ selectedDate }} / {{ selectedTime }}</div>
                    <a
                        class="info-link"
                        href="#"
                        @click.prevent="returnBack('timeStep')"
                    >Сменить
                    </a>
                </div>
                <div class='info-row' v-if="selectedDoctor.feature">
                    <div class="info-title">Особенности приема врача:</div>
                    <div class="info-value">{{ selectedDoctor.feature }}</div>
                </div>
            </div>
            <div class="form-title">
                Заполните данные пациента:
            </div>
            <form
                action=""
                class="form"
            >
                <div class="form-row">
                    <div class="form-col">
                        <div class="custom-input">
                            <input
                                class='custom-input__input'
                                type="text"
                                v-model="lastName"
                                placeholder="Фамилия"
                            >
                        </div>
                    </div>
                    <div class="form-col">
                        <div class="custom-input">
                            <input
                                class='custom-input__input'
                                type="text"
                                v-model="firstName"
                                placeholder="Имя"
                            >
                        </div>
                    </div>
                    <div class="form-col">
                        <div class="custom-input">
                            <input
                                class='custom-input__input'
                                type="text"
                                v-model="patronym"
                                placeholder="Отчество"
                            >
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <div class="custom-input">
                            <input
                                class='custom-input__input'
                                v-mask="'+7 (999) 999-99-99'"
                                inputmode="tel"
                                placeholder="Телефон"
                                v-model="phone"
                                @input="phoneValidate"
                            />
                        </div>
                        <div class='input'>
                            <input
                                class='custom-input__input'
                                v-mask="birthdayMask"
                                inputmode="numeric"
                                placeholder="Дата рождения"
                                v-model="birthday"
                                @input="birthdayValidate"
                            />
                        </div>
                    </div>
                    <div class="form-col x2">
                        <div class="custom-textarea">
                            <textarea
                                class="custom-textarea__input"
                                v-model="comment"
                                placeholder="Комментарий"
                            ></textarea>
                        </div>

                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <button
                            class="submit"
                            type="submit"
                            @click.prevent="submitForm"
                            :disabled="!formValid || submitDisabled"
                        >Записаться</button>
                    </div>
                    <div class="form-col flex-center">
                        <div class="legal">
                            Нажимая кнопку «Записаться», вы соглашаетесь с <br><a
                                target="_blank"
                                :href="$store.state.privacyPolicy"
                            >Политикой обработки персональных данных.</a>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
    import { mapActions, mapMutations } from 'vuex';
    import NotifyModal from '@/components/NotifyModal';
    import http from '@/http';

    export default {
        name: 'FormStep',
        data() {
            return {
                title: 'Запись к взрослому аллергологу',

                selectedDoctor: {},
                selectedBranch: {},
                selectedService: {},
                selectedDate: null,
                selectedTime: null,

                birthday: '',
                phone: '',
                firstName: '',
                lastName: '',
                patronym: '',
                comment: '',

                birthdayValid: false,
                phoneValid: false,
                submitDisabled: false,

                birthdayMask: {
                    alias: 'dd.mm.yyyy',
                    // inputFormat: 'dd.mm.yyyy',
                    placeholder: 'дд.мм.гггг',
                    min: '01.01.1900',
                    max: '01.01.2100',
                },
            };
        },
        methods: {
            ...mapMutations(['changeCurrentStep', 'updateSelectedDoctor', 'updateSelectedService']),
            ...mapActions(['resetToDefault', 'fireCaptcha']),

            returnBack(step) {
                if (step === 'nameStep') {
                    this.updateSelectedDoctor(null);
                    if (this.$store.state.initialFormStep === 'nameStep') {
                        this.changeCurrentStep(step);
                    } else {
                        this.changeCurrentStep('timeStep');
                    }
                } else if (step === 'specializationStep') {
                    if (this.$store.state.initialFormStep === 'nameStep') {
                        this.changeCurrentStep('timeStep');
                    } else {
                        this.changeCurrentStep(step);
                        this.updateSelectedDoctor(null);
                    }
                } else {
                    this.changeCurrentStep(step);
                }

                this.$scrollTo('#onlineAppointment', 300);
            },
            birthdayValidate(field) {
                if (field.target.inputmask.isComplete()) {
                    this.birthdayValid = true;
                } else {
                    this.birthdayValid = false;
                }
            },
            phoneValidate(field) {
                if (field.target.inputmask.isComplete()) {
                    this.phoneValid = true;
                } else {
                    this.phoneValid = false;
                }
            },
            submitForm() {
                const vm = this;
                this.submitDisabled = true;

                const selectedTime = this.selectedTime.split(' — ');

                const data = {
                    birthday: this.birthday,
                    phone: this.phone,
                    first_name: this.firstName,
                    last_name: this.lastName,
                    patronym: this.patronym,
                    comment: this.comment,
                    doctor: this.selectedDoctor.id,
                    shift: this.selectedDoctor.shift,
                    branch: this.selectedBranch.id,
                    day: this.$store.state.selectedDate.id,
                    time_from: selectedTime[0],
                    time_to: selectedTime[1],
                    type: this.$store.state.currentSpecializationsType.id,
                };

                if (this.selectedService?.id) data.service = this.selectedService.id;

                const formData = new FormData();
                for (let key in data) {
                    formData.append(key, data[key]);
                }

                this.fireCaptcha().then((token) => {
                    formData.append('recaptcha', token);
                    formData.append('page_url', window.location.href);

                    http.post('/order/add.php', formData, { cache: false })
                        .then((response) => {
                            this.$scrollTo('#onlineAppointment', 300, { offset: -60 });
                            this.submitDisabled = false;

                            if (response.data.success) {
                                this.$modal.show(
                                    NotifyModal,
                                    { type: 'success' },
                                    {
                                        adaptive: true,
                                        scrollable: true,
                                        width: '90%',
                                        maxWidth: 920,
                                        height: 'auto',
                                        minHeight: Infinity,
                                    },
                                    {
                                        'before-open': (event) => {
                                            document.body.style.overflow = 'hidden';
                                            document.body.style.paddingRight =
                                                vm.$store.state.scrollbarWidth + 'px';
                                        },
                                        closed: (event) => {
                                            document.body.style.overflow = null;
                                            document.body.style.paddingRight = null;
                                            this.resetToDefault();
                                        },
                                    }
                                );
                            } else if (response.data.error === 'error_order') {
                                this.$modal.show(
                                    NotifyModal,
                                    { type: 'error_order' },
                                    {
                                        adaptive: true,
                                        scrollable: true,
                                        width: '90%',
                                        maxWidth: 920,
                                        height: 'auto',
                                        minHeight: Infinity,
                                    },
                                    {
                                        'before-open': (event) => {
                                            document.body.style.overflow = 'hidden';
                                            document.body.style.paddingRight =
                                                vm.$store.state.scrollbarWidth + 'px';
                                        },
                                        closed: (event) => {
                                            document.body.style.overflow = null;
                                            document.body.style.paddingRight = null;
                                        },
                                    }
                                );
                            } else {
                                this.changeCurrentStep('timeStep');
                            }
                        })
                        .catch((e) => {
                            {
                                console.log(e);
                            }
                        });
                });
            },
        },
        computed: {
            formValid() {
                return (
                    this.birthdayValid &&
                    this.phoneValid &&
                    this.firstName.trim().length >= 2 &&
                    this.lastName.trim().length >= 2 &&
                    this.patronym.trim().length >= 2
                );
            },
        },
        mounted() {
            const timeData = this.$store.state.allTimeSlotsData;
            this.title = timeData.title;

            this.selectedDoctor = this.$store.state.selectedDoctor;
            this.selectedBranch = this.$store.state.selectedBranch;
            this.selectedService = this.$store.state.selectedService;
            this.selectedDate = this.$store.state.selectedDate.value.toLocaleString('ru', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
            this.selectedTime = this.$store.state.selectedTime;
        },
    };
</script>

<style scoped lang='scss'>
    @import '@/scss/custom-input.scss';
    @import '@/scss/custom-textarea.scss';

    .wrapper {
        max-width: 670px;
        margin: 0 auto;
    }

    .title {
        margin: 0 0 24px;

        color: $text-color;
        font-size: 24px;
        font-weight: 700;
        line-height: 1.3;
    }

    .info {
        margin-bottom: 40px;
    }

    .info-row {
        display: flex;
        flex-flow: row wrap;
        align-items: baseline;
        margin-bottom: 12px;

        line-height: 1.3;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .info-title,
    .info-value,
    .info-link {
        margin-bottom: 4px;
        margin-right: 24px;
        flex: 0 0 auto;
    }

    .info-title {
        font-size: 16px;
        font-weight: 700;
    }

    .info-value {
        flex: 0 1 auto;

        font-size: 16px;
    }

    .info-link {
        font-size: 12px;
        color: $text-color-light;
        text-decoration: underline;

        transition: opacity 300ms ease;

        &:hover,
        &:active,
        &:focus {
            opacity: 0.6;
        }
    }

    .form-title {
        margin: 0 0 16px;

        font-size: 16px;
        font-weight: 700;
        line-height: 1.3;
    }

    .form-row {
        display: flex;
        width: calc(100% + 16px);
        margin: 0 -8px 24px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .form-col {
        flex: 1 1 auto;
        width: 20%;
        margin: 0 8px;

        &.x2 {
            flex: 2 1 auto;

            .input {
                height: 100%;
            }
        }

        &.flex-center {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .custom-input {
        margin-bottom: 16px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .custom-textarea {
        height: 100%;

        &__input {
            height: 100%;
        }
    }

    .submit {
        flex: 0 0 auto;
        padding: 15px 24px 14px;
        width: 100%;

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

    .legal {
        color: $text-color-light;
        font-size: 12px;
        line-height: 1.6;
        text-align: center;

        a {
            font-size: inherit;
            color: $text-color-light;
            text-decoration: underline;

            transition: opacity 300ms ease;

            &:hover,
            &:active,
            &:focus {
                opacity: 0.5;
            }
        }
    }

    @media (max-width: 768px) {
        .title {
            font-size: 18px;
        }

        .info-title,
        .info-value {
            font-size: 16px;
        }

        .form-row {
            display: block;
            width: 100%;
            margin: 0 0 16px;
        }

        .form-col {
            width: 100%;
            margin: 0 0 16px;

            &:last-child {
                margin: 0;
            }
        }
    }
</style>
