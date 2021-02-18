<template>
    <div class='type-switcher'>
        <div class="type-switcher__actions">
            <button
                v-for="type in types"
                :key="type.id"
                class="type-switcher__button"
                :class="{selected: type.active}"
                @click="toggleType(type)"
            >{{ type.name }}</button>
            <!-- <button
                class="type-switcher__button"
                :class="{selected: types[1] === selected}"
                @click="toggleType(types[1])"
            >Онлайн запись ребенка до 16 лет</button> -->
        </div>
    </div>
</template>

<script>
    import { mapActions, mapMutations } from 'vuex';

    export default {
        name: 'TypeSwitcher',
        data() {
            return {};
        },
        computed: {
            types() {
                return this.$store.state.specializationsTypes;
            },
        },
        methods: {
            toggleType(type) {
                if (type.active) return;

                const currentStep = this.$store.state.currentStep;
                if (currentStep === 'timeStep' || currentStep === 'formStep') {
                    this.resetToFirstStep();
                }

                this.setActiveSpecializationsType(type);

                this.$root.$emit('typeUpdate');
            },

            ...mapMutations([
                'updateSelectedSpecialization',
                'updateSelectedBranches',
                'updateSelectedDoctor',
                'changeCurrentStep',
                'setActiveSpecializationsType',
                'resetState',
            ]),
            ...mapActions(['loadSpecializationsList', 'loadInitialData', 'resetToFirstStep']),
        },
    };
</script>

<style lang="scss" scoped>
    .type-switcher {
        margin-bottom: 40px;
        height: 36px;

        text-align: center;

        &__actions {
            position: relative;
            display: inline-flex;

            &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 1px;
                bottom: 0;
                left: 0;

                background-color: #e8e8e8;
            }
        }

        &__button {
            flex: 0 0 auto;
            position: relative;
            @include btn-reset;
            padding: 8px 16px;
            margin: 0 8px;

            color: rgba($color: $text-color, $alpha: 0.6);
            font-size: 15px;

            transition: color 300ms ease;

            &::after {
                content: '';
                position: absolute;
                z-index: 1;
                width: 100%;
                height: 3px;
                left: 0;
                bottom: -1px;

                background-color: $green;

                transform: scaleX(0);

                transition: transform 300ms ease;
            }

            &.selected {
                color: $text-color;

                &::after {
                    transform: scaleX(1);
                }
            }
        }
    }

    @media (max-width: 768px) {
        .type-switcher {
            margin-bottom: 24px;

            &__actions {
                display: block;
            }
        }
    }
</style>
