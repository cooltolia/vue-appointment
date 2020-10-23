<template>
    <div class="time-step">
        <div class="title">
            {{ title }}
        </div>
        <div class="info">
            <div
                class='info-row'
                v-if="selectedDoctor"
            >
                <div class="info-title">Врач:</div>
                <div class="info-value">{{ selectedDoctor.name }}</div>
                <a
                    class="info-link"
                    href="#"
                    @click.prevent="returnBack('nameStep')"
                >Сменить
                </a>
            </div>
            <div
                class='info-row'
                v-if="selectedSpecialization"
            >
                <div class="info-title">Специализация:</div>
                <div class="info-value">{{ selectedSpecialization.value }}</div>
                <a
                    class="info-link"
                    href="#"
                    @click.prevent="returnBack('specializationStep')"
                >Сменить
                </a>
            </div>
            <div
                class='info-row'
                v-if="selectedBranches"
            >
                <div class="info-title">Филиал:</div>
                <div class="info-value">{{ selectedBranches }}</div>
                <a
                    class="info-link"
                    href="#"
                    @click.prevent="returnBack('specializationStep')"
                >Сменить
                </a>
            </div>
        </div>
        <div class="data">

            <keep-alive>
                <div class="calendar">
                    <div v-if='!calendarReady'>calendar loading</div>
                    <transition name='fade'>
                        <div
                            :is="calendarComponent"
                            ref='calendar'
                            v-model="selectedDate"
                            mode="single"
                            color="green"
                            :available-dates="availableDates"
                            :min-page="minPage"
                            :max-page="maxPage"
                            :navVisibility="'hidden'"
                            is-inline
                            :is-required="true"
                            @hook:mounted="calendarMounted"
                        >
                        </div>
                    </transition>

                </div>
            </keep-alive>
            <transition name='fade'>
                <div class="doctors">
                    <simplebar
                        data-simplebar-auto-hide="false"
                        class="list"
                        ref='doctorsList'
                    >
                        <div
                            class='card'
                            v-for='(card, i) in optionsList'
                            :key='i'
                        >
                            <DoctorCard
                                :doctorId='card.doctor.id'
                                :branchId='card.branch.id'
                                :doctorData="{avatar: card.doctor.photo, name: card.doctor.name, profession: card.doctor.position}"
                                :address='card.branch.name'
                                :metro='card.branch.metro'
                                :workTime='card.slots'
                            ></DoctorCard>
                        </div>
                    </simplebar>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';
    import DoctorCard from '@/components/DoctorCard';
    import simplebar from 'simplebar-vue';
    import 'simplebar/dist/simplebar.min.css';

    export default {
        name: 'TimeStep',
        components: {
            DoctorCard,
            simplebar,
        },
        data() {
            return {
                loading: true,
                title: '',
                selectedDoctor: null,
                selectedSpecialization: null,
                selectedBranches: null,

                scroll: null,

                optionsList: [],

                selectedDate: null,

                availableDates: [],
                minPage: null,
                maxPage: null,

                calendarComponent: '',
                calendarReady: false,
            };
        },
        watch: {
            selectedDate(newValue, oldValue) {
                debugger;
                this.updateSelectedDate(newValue);
                const newDate = newValue.getTime() / 1000;
                // if (oldValue) this.optionsList = [];

                this.optionsList = this.$store.state.allTimeSlotsData.schedule[newDate].items;
            },
        },
        methods: {
            ...mapMutations(['changeCurrentStep', 'updateSelectedDate']),

            returnBack(step) {
                this.changeCurrentStep(step);
            },
            calendarMounted() {
                this.calendarReady = true;
            },
        },

        mounted() {
            const timeData = this.$store.state.allTimeSlotsData;

            this.title = timeData.title;

            this.selectedDoctor = this.$store.state.selectedDoctor;
            this.selectedSpecialization = this.$store.state.selectedSpecialization;
            if (this.$store.state.selectedBranches) {
                this.selectedBranches = Object.values(this.$store.state.selectedBranches)
                    .map((branch) => branch.value)
                    .join(' / ')
                    .replace(/\/\s*$/, '');
            }

            this.availableDates = Object.keys(timeData.schedule).map((time) => new Date(time * 1000));
            this.selectedDate = this.availableDates[0];

            this.minPage = { month: timeData.month_min.number, year: +timeData.month_min.year };
            this.maxPage = { month: timeData.month_max.number, year: +timeData.month_max.year };

            this.updateSelectedDate(this.selectedDate);

            const selectedDayId = this.selectedDate.getTime() / 1000;
            this.optionsList = timeData.schedule[selectedDayId].items;

            setTimeout(() => {
                this.calendarComponent = 'v-date-picker';
                // this.scroll = new SimpleBar(this.$refs.doctorsList);
            }, 0);
        },
    };
</script>

<style lang='scss' scoped>
    .time-step {
        /deep/ .vc-container {
            --header-padding: 20px 20px 0 20px;
            --weeks-padding: 16px 20px;
            --day-content-width: 42px;
            --day-content-height: 42px;
            --day-content-margin: 3px;

            --highlight-height: 40px;

            --day-content-bg-color-hover: rgba(130, 191, 49, 0.3);

            background: #ffffff;
            box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.12);
            border: none;
            border-radius: 0;

            font-family: $font;

            .vc-bg-green-600 {
                background-color: $green;
            }

            .vc-text-gray-900 {
                color: #2c2c2c;
            }

            .vc-title {
                color: #fff;
                text-transform: capitalize;

                font-weight: 700;
                font-size: 20px;
            }

            .vc-title-layout {
                height: 55px;
                display: flex;

                background-color: $green;
                box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.12);
                border-radius: 8px;
            }

            .vc-weekday {
                position: relative;
                padding: 0;
                width: 42px;
                height: 42px;
                margin-bottom: 16px;

                color: #2c2c2c;
                font-size: 18px;
                font-weight: 600;
                text-transform: uppercase;

                &::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    left: 0;
                    bottom: -8px;

                    background-color: $green;
                }
            }

            .vc-day-content {
                font-size: 18px;
                font-weight: 400;

                border: 2px solid transparent;

                transition: background-color 300ms ease, border-color 300ms ease;
            }

            .is-today {
                .vc-day-content {
                    border-color: $green;
                }
            }

            .vc-highlights {
                + .vc-day-content {
                    font-weight: 600;

                    &:hover,
                    &:active,
                    &:focus {
                        background-color: transparent;
                    }
                }
            }

            .vc-arrows-container {
                top: 22px;
                width: auto;
                left: 16px;
                right: 16px;

                [role='button'] {
                    color: #fff;
                }
            }
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

        .data {
            display: flex;
        }

        .calendar {
            width: 376px;
            min-height: 452px;
            flex: 0 0 auto;
        }

        .doctors {
            position: relative;
            width: 50%;
            flex: 1 1 auto;

            .list {
                position: absolute;
                top: 0;
                left: 0;
                padding-left: 40px;
                padding-right: 40px;
                width: calc(100% + 40px);
                height: calc(100% + 40px);

                /deep/ .simplebar-track.simplebar-vertical {
                    right: 16px;
                }
            }

            .card {
                margin-bottom: 24px;

                &:last-child {
                    margin-bottom: 40px;
                }
            }
        }

        @media (max-width: 768px) {
            .title {
                font-size: 18px;
            }

            .calendar {
                width: 276px;
                min-height: 348px;
            }

            .data {
                display: block;
            }

            .doctors {
                margin-top: 24px;
                width: 100%;
                height: 400px;

                .list {
                    width: 100%;
                    height: 100%;
                    padding: 0;

                    /deep/ .simplebar-track.simplebar-vertical {
                        right: -12px;
                        bottom: 40px;
                    }
                }
            }
        }
        @media (max-width: 475px) {
            /deep/ .vc-container {
                --header-padding: 12px 12px 0 12px;
                --weeks-padding: 10px 12px;
                --day-content-width: 32px;
                --day-content-height: 32px;
                --day-content-margin: 2px;

                --highlight-height: 34px;

                --day-content-bg-color-hover: rgba(130, 191, 49, 0.3);

                .vc-title {
                    font-size: 16px;
                }

                .vc-title-layout {
                    height: 55px;
                    display: flex;

                    background-color: $green;
                    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.12);
                    border-radius: 8px;
                }

                .vc-weekday {
                    width: 32px;
                    height: 32px;
                    margin-bottom: 12px;

                    font-size: 14px;

                    &::after {
                        bottom: -6px;
                    }
                }

                .vc-day-content {
                    font-size: 14px;
                }

                .vc-arrows-container {
                    top: 16px;
                    left: 12px;
                    right: 12px;
                }
            }
            .doctors {
                margin-top: 24px;
                width: 100%;
                height: 400px;

                .list {
                    width: 100%;
                    height: 100%;
                    padding: 0;

                    /deep/ .simplebar-track.simplebar-vertical {
                        right: -12px;
                        bottom: 40px;
                    }
                }
            }
        }
    }
</style>