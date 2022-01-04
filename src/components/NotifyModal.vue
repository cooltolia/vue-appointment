<template>
    <div class="notify-modal">
        <div
            class="content success"
            v-if="type === 'success' || type === 'success_request'"
        >
            <img
                :src="successImage"
                alt=""
                class="image"
            >
            <button
                class='close'
                @click="$emit('close')"
            ></button>
            <div class="title">
                Спасибо!
            </div>
            <div
                class="text"
                v-html="$store.state.modals[type]"
            >
            </div>
            <button
                class="button"
                type='button'
                @click="$emit('close')"
            >Назад</button>
        </div>
        <div
            class="content"
            v-else
        >
            <img
                :src="errorImage"
                alt=""
                class="image"
            >
            <button
                class='close'
                @click="$emit('close')"
            ></button>
            <div class="title">
                Ошибка!
            </div>
            <div
                class="text"
                v-html="$store.state.modals[type]"
            >
            </div>
            <div v-if="type === 'error_schedule'">
                <button
                    class="button green"
                    type='button'
                    @click.prevent="$emit('close'); triggerCallback($event, selectedSpecializationName)"
                >Заказать звонок коллцентра</button>
            </div>
            <button
                class="button"
                type='button'
                @click="$emit('close')"
            >Назад</button>
        </div>
    </div>
</template>

<script>
    const successImage = require('@/assets/images/success.svg');
    const errorImage = require('@/assets/images/error.svg');
    import CallbackModal from '@/components/CallbackModal.vue';

    export default {
        name: 'NotifyModal',
        props: ['type'],
        data() {
            return {
                successImage,
                errorImage,
            };
        },
        computed: {
            selectedSpecializationName() {
                return this.$store.state.selectedSpecialization?.name;
            },
        },
        methods: {
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
        },
        // methods: {
        //     open() {
        //         this.$modal.show(
        //             NotifyModal,
        //             { type: 'error' },
        //             {
        //                 adaptive: true,
        //                 scrollable: true,
        //                 width: '90%',
        //                 maxWidth: 920,
        //                 height: 'auto',
        //                 minHeight: Infinity,
        //             },
        //             {
        //                 'before-open': (event) => {
        //                     document.body.style.overflow = 'hidden';
        //                     document.body.style.paddingRight = vm.$store.state.scrollbarWidth + 'px';
        //                 },
        //                 closed: (event) => {
        //                     document.body.style.overflow = null;
        //                     document.body.style.paddingRight = null;
        //                 },
        //             }
        //         );
        //     },
        // },
    };
</script>

<style lang='scss' scoped>
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

    .notify-modal {
        display: flex;
        justify-self: center;
        align-items: center;
        padding: 70px;
        // min-height: 450px;

        .content {
            max-width: 720px;
            margin: 0 auto;

            color: $text-color;
            text-align: center;

            &.success {
                .button {
                    background-color: $green;
                    border: 2px solid $green;
                }
            }
        }

        .image {
            width: 44px;
            height: 44px;
            margin: 0 auto 30px;
        }

        .title {
            margin: 0 0 16px;

            color: $text-color;
            font-size: 18px;
            font-weight: 600;
            line-height: 1.3;
        }

        .text {
            margin: 0 0 16px;
            font-size: 18px;
            line-height: 1.9;
        }

        .button {
            padding: 15px 24px 14px;
            display: inline-flex;
            justify-content: center;
            min-width: 160px;
            margin-top: 20px;

            color: $text-color-white;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;

            background-color: $theme-color;
            border: 2px solid $theme-color;
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

            &.green {
                color: $text-color-white;

                background-color: $green;
                border: 2px solid $green;

                &:hover,
                &:active,
                &:focus {
                    color: $text-color;

                    background-color: #fff;
                }
            }
        }

        @media (max-width: 768px) {
            padding: 40px 20px;

            .text {
                font-size: 16px;
                line-height: 1.6;
            }
        }
    }
</style>
