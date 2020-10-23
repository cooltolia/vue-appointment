<template>
    <div
        class="v-doctor-card"
        :data-doctor-id='doctorId'
        :data-branch-id='branchId'
    >
        <div class="info">
            <div class="info-header">
                <div class="avatar">
                    <img
                        :src="doctorData.avatar"
                        :alt="doctorData.name"
                    >
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
            <div class="info-address">
                <div class="address">
                    {{ address }}
                </div>
                <div class="metro">
                    {{ metro }}
                </div>
            </div>
        </div>
        <div
            class="worktime"
            @click="timeSelect"
        >
            <button
                v-for="(time, index) of workTime"
                :key="index"
                class="window"
                type='button'
            >
                {{ time.from }} — {{ time.to }}
            </button>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        name: 'DoctorCard',
        props: {
            doctorId: {
                type: Number,
            },
            branchId: {
                type: Number,
            },
            doctorData: {
                type: Object,
                default: () => ({
                    avatar: '',
                    name: '',
                    profession: '',
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

            timeSelect(e) {
                if (e.target.tagName.toLowerCase() === 'button') {
                    const parentCard = e.target.closest('.v-doctor-card');
                    const doctorId = parentCard.dataset.doctorId;
                    const branchId = parentCard.dataset.branchId;
                    e.target.classList.add('selected');
                    this.updateSelectedTime(e.target.textContent.trim());
                    this.updateSelectedDoctor({name: this.doctorData.name, id: doctorId});
                    this.updateSelectedBranch({value: this.address, id: branchId});
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
            width: 62px;
            height: 62px;
            flex: 0 0 auto;
            margin-right: 10px;

            border: 3px solid $green;
            border-radius: 50%;
            overflow: hidden;

            img {
                display: block;
                width: 100%;
                height: 100%;
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

                transition: border-color 300ms ease;

                &.selected {
                    border-color: $green;
                }
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
                    min-width: 100px;
                    height: 40px;
                    margin: 0 8px 16px;

                    font-size: 14px;
                }
            }
        }
    }
</style>
