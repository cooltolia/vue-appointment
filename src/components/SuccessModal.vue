<template>
    <div class="success-modal">
        <div class="content">
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
            <p class="text">
                Мы забронировали время специалиста для вас. В ближайшее время вам позвонит оператор контактного центра, чтобы подтвердить детали записи.
                Если вы не сможете ответить — мы перезвоним еще два раза и если не дозвонимся, то, к сожалению, отменим запись.
            </p>
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

    export default {
        name: 'SuccessModal',
        data() {
            return {
                successImage,
            };
        },
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

    .success-modal {
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

        @media (max-width: 768px) {
            padding: 40px 20px;

            .text {
                font-size: 16px;
                line-height: 1.6;
            }
        }
    }
</style>
