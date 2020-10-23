<template>
    <div
        class="custom-select"
        :class="{disabled: dataLoaded}"
    >
        <input
            class="custom-select__value"
            type="hidden"
            v-if="name"
            :name="name"
            @change="handleChange"
            @clear="handleClear"
        >
        <button
            class="custom-select__selected"
            type="button"
            tabindex="0"
        >{{placeholder}}
        </button>
        <div
            class="custom-select__dropdown"
            aria-expanded="false"
        >
            <ul class="custom-select__options">
                <li
                    v-for='item in items'
                    :key="item.id"
                    :data-id="item.id"
                    class="custom-select__option"
                    tabindex="0"
                >
                    {{ item.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import СustomSelect from '@/common/CustomSelect';

    export default {
        name: 'CustomSelect',
        props: {
            placeholder: {
                type: String,
                default: 'Выберите значение',
            },
            items: Array,
            options: Object,
            name: String,
            dataLoaded: Boolean,
        },
        data() {
            return {
                select: null,
            };
        },
        methods: {
            handleChange(e) {
                this.$emit('change', {value: e.target.value, id: e.target.dataset.id});
            },
            handleClear() {
                this.select.clearSelected();
            },
        },
        mounted() {
            this.select = new СustomSelect(this.$el, this.options);

            this.$root.$on('typeUpdate', () => {
                this.select.clearSelected();
            });
        },
    };
</script>

<style lang="scss" scoped>
    .custom-select {
        position: relative;
        width: 100%;

        font-family: $font;

        transition: opacity 300ms ease;

        &.disabled {
            opacity: 0.5;
            pointer-events: none;
        }

        &:focus-within {
            .custom-select__selected {
                outline: 1px solid $text-color;
            }
        }

        &.error {
            animation: jitter 300ms ease-in-out forwards;
        }

        &.no-select {
            .custom-select__selected {
                &:hover,
                &:active,
                &:focus {
                    border-color: #f0f4f9;
                }

                &::after {
                    display: none;
                }
            }
        }

        &__label {
            display: block;
            margin: 0 0 12px;

            font-size: 15px;
            line-height: 1.4;
            font-weight: 600;
        }

        &__selected {
            @include btn-reset;
            width: 100%;
            position: relative;
            height: 50px;
            // display: flex;
            // align-items: center;
            padding-left: 20px;
            padding-right: 42px;

            color: $text-color;
            font-size: 16px;
            line-height: 1;
            text-align: left;

            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            background-color: $bg;

            transition: background-color 300ms ease;

            &:hover,
            &:active,
            &:focus {
                background-color: rgba($color: $bg, $alpha: 0.5);
            }

            &:focus {
                outline: 1px solid $text-color;
            }

            &::after {
                content: '';
                position: absolute;
                width: 6px;
                height: 6px;
                top: 50%;
                right: 20px;

                transform: translateY(-50%) rotate(45deg);

                border-width: 0 2px 2px 0;
                border-style: solid;
                border-color: $green;

                transition: transform 300ms ease;
            }

            &.opened::after {
                transform: translateY(-10%) rotate(225deg);
            }
        }

        &__dropdown {
            display: none;
            position: absolute;
            z-index: 9;
            width: 100%;
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

        &__options {
            margin: 0;
            padding: 20px 30px;

            list-style: none;

            &.multiple {
                .custom-select__option {
                    position: relative;
                    padding-left: 36px;

                    text-decoration: none;

                    &::before,
                    &::after {
                        content: '';
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        top: 50%;
                        left: 0px;
                        transform: translateY(-50%);

                        border: 1px solid $green;
                        background-color: #fff;

                        transition: opacity 300ms ease;
                    }

                    &::after {
                        opacity: 0;

                        background-image: url('~@/assets/images/check.svg');
                        background-size: 11px 9px;
                        background-position: center;
                        background-repeat: no-repeat;
                    }

                    // &:active,
                    // &:focus {
                    //     opacity: 1;
                    // }

                    &.selected {
                        text-decoration: underline;
                        &::after {
                            opacity: 1;
                        }
                    }
                }
            }
        }

        &__option {
            padding: 10px 0;

            color: $text-color;
            font-size: 16px;
            text-decoration: underline;

            transition: opacity 300ms ease;

            outline: none;
            cursor: pointer;

            &:hover,
            &:active,
            &:focus {
                opacity: 0.6;
            }

            &:focus {
                text-decoration: none;
            }
        }
    }

    @keyframes jitter {
        0% {
            transform: translateX(0);
        }

        10% {
            transform: translateX(-5px);
        }

        25% {
            transform: translateX(5px);
        }

        50% {
            transform: translateX(-5px);
        }

        75% {
            transform: translateX(7px);
        }

        100% {
            transform: translateX(0);
        }
    }
</style>
