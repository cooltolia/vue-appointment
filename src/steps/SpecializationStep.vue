<template>
    <div>

        <div class='specialization-step'>
            <div class="selects">
                <div class="select">
                    <custom-select
                        ref="specializationSelect"
                        :items="specializations"
                        :placeholder="'Выберите направление'"
                        :name="'appointment_specialization'"
                        :options="{onSelect: onSpecializationSelect}"
                        :dataLoaded="specializations.length === 0"
                    ></custom-select>
                </div>
                <div class="select">
                    <custom-select
                        ref="branchesSelect"
                        :items="branches"
                        :placeholder="'Выберите филиал'"
                        :name="'appointment_branches'"
                        :options="{multiple: true, multipleCounterLabel: 'Выбрано филиалов', onSelect: onBranchSelect}"
                        :dataLoaded="branches.length === 0 || !selectedSpecialization"
                    ></custom-select>
                    <!-- {{!selectedSpecialization}} -->
                </div>
            </div>
            <div class="actions">
                <a
                    href="#"
                    class="link bold"
                    @click.prevent="$store.commit('changeCurrentStep', 'nameStep')"
                >Найти врача по ФИО</a>
                <a
                    href="#"
                    class="link"
                    @click.prevent="triggerCallback"
                >Заказать звонок коллцентра</a>
                <button
                    class='submit'
                    type="button"
                    :disabled='!formValid'
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
            // CallbackModal,
        },
        data() {
            return {
                selectedSpecialization: null,
                selectedBranches: {},

                // specializationValue: '',
                // branchesValue: '',
            };
        },
        computed: {
            formValid() {
                return !!this.selectedSpecialization && !!Object.keys(this.selectedBranches).length > 0;
            },
            specializations() {
                return this.$store.state.specializationsList;
            },
            branches() {
                return this.$store.state.branchesList;
            },
        },
        methods: {
            ...mapMutations([
                'updateSelectedSpecialization',
                'updateSelectedBranches',
                'updateSelectedBranch',
                'changeCurrentStep',
                'updateSelectedDoctor',
            ]),
            ...mapActions(['loadBranchesList', 'submitSpecilizationBranchData']),
            onSpecializationSelect(item) {
                this.selectedSpecialization = item;

                this.loadBranchesList(item);
                this.updateSelectedSpecialization(item);
                this.$refs.branchesSelect.select.clearSelected();

                this.loadBranchesList(item).then(() => {});
            },
            onBranchSelect(selectedValue) {
                if (selectedValue.action === 'add') {
                    this.$set(this.selectedBranches, selectedValue.id, selectedValue);
                } else {
                    // delete this.selectedBranches[selectedValue.id];
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
                const formData = {
                    specialization: this.selectedSpecialization.id,
                    branches: Object.keys(this.selectedBranches),
                };

                this.submitSpecilizationBranchData(formData).then(() => {
                    this.changeCurrentStep('timeStep');
                });
            },
        },
        mounted() {
            this.updateSelectedSpecialization(null);
            this.updateSelectedBranches(null);
            this.updateSelectedBranch(null);
            this.updateSelectedDoctor(null);
        },
    };
</script>

<style lang='scss' scoped>
    .specialization-step {
        max-width: 695px;
        margin: 0 auto;

        .selects {
            display: flex;
            flex-flow: row nowrap;
            margin: 0 -8px 16px;
        }

        .select {
            width: 40%;
            flex: 1 1 auto;
            margin: 0 8px;
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
