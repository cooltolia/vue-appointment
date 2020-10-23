<template>
    <div class="callback-modal">
        <button
            class='close'
            @click="$emit('close')"
        ></button>
        <transition
            name="fade"
            mode='out-in'
        >
            <div
                class="success-info"
                v-if='formSended'
            >
                <div class="title">
                    Заявка успешно отправлена!
                </div>
                <img
                    :src="successImage"
                    alt=""
                    class='image'
                >
                <button
                    type='button'
                    class='button'
                    @click="$emit('close')"
                >Вернуться назад</button>
            </div>
            <form
                action=""
                class="form"
                v-else
            >
                <div class="form-title">
                    Заказать звонок коллцентра
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <div class="custom-input">
                            <input
                                class='custom-input__input'
                                type="text"
                                v-model="name"
                                placeholder="ФИО"
                            >
                        </div>
                    </div>
                    <div class="form-col">
                        <div class="custom-input">
                            <the-mask
                                class='custom-input__input'
                                mask="+7 (###) ###-##-##"
                                type="tel"
                                :masked="false"
                                placeholder="Телефон"
                                v-model="phone"
                            ></the-mask>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col full">
                        <div class="custom-textarea">
                            <textarea
                                class="custom-textarea__input"
                                v-model="comment"
                                placeholder="Комментарий"
                            ></textarea>
                        </div>

                    </div>
                </div>
                <div class="form-row bottom">
                    <div class="form-col">
                        <button
                            class="submit"
                            type="submit"
                            @click.prevent="submitForm"
                            :disabled="!formValid"
                        >Записаться</button>
                    </div>
                    <div class="form-col flex-center">
                        <div class="legal">
                            Нажимая кнопку я соглашаюсь с <br><a href="#">Политикой конфиденциальности</a>
                        </div>
                    </div>
                </div>
            </form>
        </transition>
    </div>
</template>

<script>
    const successImage = require('@/assets/images/success.svg');

    export default {
        name: 'CallbackModal',
        data() {
            return {
                name: '',
                phone: '',
                comment: '',
                formSended: false,

                successImage,
            };
        },
        computed: {
            formValid() {
                return this.phone.length === 10;
            },
        },
        methods: {
            submitForm() {
                this.formSended = true;
            },
        },
    };
</script>

<style lang='scss' scoped>
    @import '@/scss/custom-input.scss';
    @import '@/scss/custom-textarea.scss';

    .close {
        @include btn-reset;
        position: absolute;
        width: 32px;
        height: 32px;
        top: 12px;
        right: 12px;

        background-image: url('~@/assets/images/close.svg');
        background-size: 9px;
        background-position: center;
        background-repeat: no-repeat;
    }

    .callback-modal {
        display: flex;
        justify-self: center;
        align-items: center;
        padding: 80px;
        min-height: 450px;
    }

    .form {
        width: 100%;
        max-width: 526px;
    }

    .form-title {
        margin: 0 0 20px;

        font-size: 18px;
        font-weight: 600;
        line-height: 1.3;
    }

    .form-row {
        display: flex;
        margin: 0 -12px 16px;

        &.bottom {
            margin-top: 24px;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }

    .form-col {
        flex: 1 1 auto;
        width: 50%;
        padding: 0 12px;

        &.flex-center {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .custom-textarea__input {
            height: 100px;
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

    .success-info {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        margin: 0 auto;

        color: $text-color;

        .title {
            color: $text-color;
            font-size: 18px;
            font-weight: 600;
            line-height: 1.3;
        }

        .image {
            width: 110px;
            height: 110px;
            margin: 20px 0;
        }

        .button {
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
        }
    }

    @media (max-width: 768px) {
        .callback-modal {
            padding: 40px 20px;
        }

        .form-row {
            display: block;
            margin: 0 0 16px;
        }

        .form-col {
            width: 100%;
            padding: 0;
            margin: 0 0 16px;
        }
    }
</style>
