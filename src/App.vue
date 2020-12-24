<template>
    <div
        id="onlineAppointment"
        class='online-appointment'
    >
        <div class="inner">

            <TypeSwitcher></TypeSwitcher>
            <div
                class="online-appointment__body"
            >
                <transition
                    name='fade'
                    mode="out-in"
                >
                    <SpecializationStep v-if="actionStep === 'specializationStep'"></SpecializationStep>
                    <NameStep v-if="actionStep === 'nameStep'"></NameStep>
                    <TimeStep v-if="actionStep === 'timeStep'"></TimeStep>
                    <FormStep v-if="actionStep === 'formStep'"></FormStep>
                </transition>
            </div>

        </div>

    </div>
</template>

<script>
    import TypeSwitcher from './components/TypeSwitcher.vue';
    import SpecializationStep from './steps/SpecializationStep';
    import NameStep from './steps/NameStep';
    import TimeStep from './steps/TimeStep';
    import FormStep from './steps/FormStep';

    export default {
        name: 'App',
        components: {
            TypeSwitcher,
            SpecializationStep,
            NameStep,
            TimeStep,
            FormStep,
        },
        computed: {
            actionStep() {
                return this.$store.state.currentStep;
            },
        },
        mounted() {
            function getScrollbarWidth() {
                return window.innerWidth - document.documentElement.clientWidth;
            }
            this.$store.commit('setScrollbarWidth', getScrollbarWidth());

            this.$store.dispatch('loadInitialData');

        },
    };
</script>

<style lang='scss'>
    .online-appointment {
        .inner {
            @include container;
        }

        &__body {
            padding: 40px;

            background: #ffffff;
            box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
            &__body {
                padding: 30px 20px;
            }
        }
    }

    .fade-enter-active {
        animation: fade 300ms ease-in-out;
    }

    .fade-leave-active {
        animation: fade 300ms ease-in-out reverse;
    }

    @keyframes fade {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
</style>
