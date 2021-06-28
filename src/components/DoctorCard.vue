<template>
    <div class="v-doctor-card">
        <div class="info">
            <div class="info-header">
                <div
                    class="avatar"
                    @click="toggleDoctorInfo"
                    :class="{toggle: doctorData.experience.years || doctorData.experience.description}"
                >
                    <img
                        :src="doctorData.avatar"
                        :alt="doctorData.name"
                    >
                    <i v-if="doctorData.experience.years || doctorData.experience.description">i</i>
                </div>
                <div class="info-data">
                    <div class="name">
                        {{ doctorData.name }}
                    </div>
                    <div class="profession">
                        {{ doctorData.profession }}
                    </div>
                </div>
            </div>
            <div
                class="info-doctor"
                ref="doctorInfo"
                v-if="doctorData.experience.years || doctorData.experience.description"
            >
                <button
                    class='close'
                    @click="toggleDoctorInfo"
                ></button>
                <div
                    class="experience"
                    v-if='doctorData.experience.years'
                >Стаж врачебной практики: {{ doctorData.experience.years }}</div>
                <div
                    v-if="doctorData.experience.description"
                    v-html="doctorData.experience.description"
                ></div>
            </div>
            <div class="info-address">
                <div class="address">
                    {{ address }}
                </div>
                <div class="metro">
                    {{ metro }}
                </div>
            </div>
        </div>
        <div class="worktime">
            <button
                v-for="(time, index) of workTime"
                :key="index"
                class="window"
                type='button'
                @click="timeSelect($event, time)"
            >
                {{ time.from }} — {{ time.to }}
            </button>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';
    import $$ from '@/common/plugins';

    export default {
        name: 'DoctorCard',
        props: {
            doctorId: {
                type: [String, Number],
            },
            branchId: {
                type: [String, Number],
            },
            doctorData: {
                type: Object,
                default: () => ({
                    avatar: '',
                    name: '',
                    profession: '',
                    experience: {
                        years: '',
                        description: '',
                    },
                }),
            },
            address: {
                type: String,
            },
            metro: {
                type: String,
                default: '',
            },
            workTime: {
                type: Array,
            },
        },
        methods: {
            ...mapMutations([
                'changeCurrentStep',
                'updateSelectedTime',
                'updateSelectedDoctor',
                'updateSelectedBranch',
            ]),

            toggleDoctorInfo() {
                if (this.$refs.doctorInfo) $$.slideToggle(this.$refs.doctorInfo);
            },

            timeSelect(e, time) {
                if (e.target.tagName.toLowerCase() === 'button') {
                    e.target.classList.add('selected');
                    console.log(time.id_shift);
                    this.updateSelectedTime(e.target.textContent.trim());
                    this.updateSelectedDoctor({
                        name: this.doctorData.name,
                        id: this.doctorId,
                        shift: time.id_shift,
                    });
                    this.updateSelectedBranch({ value: this.address, id: this.branchId });
                    this.changeCurrentStep('formStep');
                }
            },
        },
    };
</script>

<style lang='scss' scoped>
    .v-doctor-card {
        color: $text-color;

        background: #ffffff;
        box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.1);

        overflow: hidden;

        .info {
            padding: 40px 40px 0;

            background-color: #fff;
        }

        .info-header {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
        }

        .avatar {
            position: relative;
            width: 62px;
            height: 62px;
            flex: 0 0 auto;
            margin-right: 10px;

            border: 3px solid $green;
            border-radius: 50%;

            &.toggle {
                cursor: pointer;
            }

            img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 50%;

                font-size: 8px;
            }

            i {
                position: absolute;
                width: 16px;
                height: 16px;
                bottom: 0;
                right: -4px;
                display: flex;
                justify-content: center;
                align-items: center;

                font-size: 12px;
                color: $text-color-white;
                font-weight: 700;
                font-style: normal;

                background-color: $green;
                border-radius: 50%;
            }
        }

        .name {
            margin-bottom: 4px;

            font-size: 16px;
            font-weight: 700;
            line-height: 1.3;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .profession {
            font-size: 12px;
        }

        .info-address {
            position: relative;
            padding-left: 26px;
            margin-top: 24px;
            margin-bottom: 24px;

            color: $text-color-dark;

            &::before {
                content: '';
                position: absolute;
                width: 18px;
                height: 22px;
                top: 0;
                left: 0;

                background-image: url('~@/assets/images/pointer.svg');
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
            }
        }

        .address {
            margin-bottom: 4px;
            font-size: 16px;
            font-weight: 600;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .metro {
            font-size: 14px;
        }

        .worktime {
            padding: 24px 40px 8px;
            display: flex;
            flex-flow: row wrap;
            margin: 0 -15px;

            background-color: $bg;

            button {
                @include btn-reset;
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1 1 auto;

                width: calc(33% - 30px);
                max-width: calc(33% - 30px);
                min-width: 125px;

                height: 50px;
                margin: 0 15px 24px;

                font-size: 18px;
                color: $text-color-dark;

                border: 2px solid #f0f0f0;
                background-color: #fff;

                transition: border-color 300ms ease;

                &.selected {
                    border-color: $green;
                }
            }
        }

        .info-doctor {
            display: none;
            position: relative;
            width: calc(100% + 80px);
            margin-left: -40px;
            padding: 32px 40px;
            background-color: $bg;

            color: $text-color-dark;
            font-size: 14px;

            .experience {
                margin: 0 0 24px;

                &:last-child {
                    margin-bottom: 0;
                }

                font-weight: 600;
            }

            /deep/ p {
                margin: 0 0 8px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            .close {
                @include btn-reset;
                position: absolute;
                width: 32px;
                height: 32px;
                top: 6px;
                right: 24px;

                background-image: url('~@/assets/images/close.svg');
                background-size: 18px;
                background-position: center;
                background-repeat: no-repeat;
            }
        }

        @media (max-width: 768px) {
            .info {
                padding: 20px 20px 0;
            }

            .name,
            .address {
                font-size: 14px;
            }

            .worktime {
                padding: 24px 20px 8px;

                button {
                    min-width: 110px;
                    height: 40px;
                    margin: 0 8px 16px;

                    font-size: 14px;
                }
            }
        }
    }
</style>
