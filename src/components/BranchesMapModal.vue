<template>
    <div class="branches-map-modal">
        <button
            class='close'
            @click="$emit('close')"
        ></button>
        <transition
            name="fade"
            mode='out-in'
        >
            <yandex-map
                :coords="coords"
                :zoom="zoom"
                class='map-container'
                :controls="['zoomControl']"
                @map-was-initialized="mapLoaded"
                style='height: 300px'
            >
            </yandex-map>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'BranchesMapModal',
        data() {
            return {};
        },
        props: ['selected', 'branches'],
        methods: {
            mapLoaded(myMap) {
                const vm = this;
                debugger;
                const branches = this.branches.map((branch) => {
                    return {
                        id: branch.id,
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: branch.coordinates },
                        selected: branch.selected
                    };
                });

                const objectManager = new ymaps.ObjectManager({
                    clusterize: true,
                    gridSize: 32,
                    clusterIconColor: '#0075ac',
                    // preset: 'islands#redClusterIcons',
                    // clusterDisableClickZoom: true
                });

                const iconLayout = ymaps.templateLayoutFactory.createClass(
                    '<svg width="54" height="72" viewBox="0 0 54 72" fill="none" id="{{ id }}" class="map-icon {% if selected %}selected{% endif %}"><path d="M25.8693 69.2621L25.8693 69.2621C25.3993 68.8486 19.2646 63.3908 13.2592 55.3638C7.22007 47.2916 1.5 36.8682 1.5 26.4867C1.5 12.711 12.7154 1.5 26.5 1.5C40.2846 1.5 51.5 12.711 51.5 26.4867C51.5 36.8683 45.7799 47.2918 39.7407 55.3639C33.7353 63.391 27.6007 68.8487 27.1309 69.2622C26.9506 69.4208 26.7272 69.5 26.5 69.5C26.2731 69.5 26.0496 69.4207 25.8693 69.2621ZM35.3612 26.4867C35.3612 21.5725 31.4016 17.5511 26.5 17.5511C21.5984 17.5511 17.6388 21.5725 17.6388 26.4867C17.6388 31.401 21.5984 35.4223 26.5 35.4223C31.4016 35.4223 35.3612 31.401 35.3612 26.4867Z" stroke="white" stroke-width="3"/></svg>'
                );

                objectManager.objects.options.set(
                    {
                        iconLayout,
                        hasBalloon: false,
                        options: {
                            id: 'mapIcon',
                        },
                        iconShape: {
                            type: 'Rectangle',
                            coordinates: [
                                [-27, -72],
                                [27, 0],
                            ],
                        },
                    },
                    {
                        id: 'mapIcon',
                    }
                );

                objectManager.add(branches);

                objectManager.objects.events.add('click', markerOnClickEvent);

                objectManager.objects.events.add('mouseenter', (e) => {
                    const pointId = e.get('objectId');
                    const icon = document.getElementById(pointId);
                    icon.classList.add('active');
                });

                objectManager.objects.events.add('mouseleave', (e) => {
                    // on touch events work with click only
                    if (e._sourceEvent.originalEvent.domEvent.originalEvent.type === 'touchend') return;

                    const pointId = e.get('objectId');
                    const icon = document.getElementById(pointId);
                    icon.classList.remove('active');
                });

                myMap.behaviors.disable('scrollZoom');
                myMap.geoObjects.add(objectManager);

                function markerOnClickEvent(e) {
                    e.stopPropagation();
                    const pointId = e.get('objectId');
                    const clickType = e.get('type');
                    const icon = document.getElementById(pointId);
                    icon.classList.toggle('selected');

                    vm.selected(pointId);
                }
            },
        },
        created() {
            const data = window.branches;
            this.coords = data.mapCenter;
            this.zoom = data.zoom;
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

    .branches-map-modal {
        padding: 80px;
        min-height: 450px;

        /deep/ .map-icon {
            fill: $theme-color;
            display: block;
            position: absolute;
            z-index: 9999999;
            top: -70px;
            left: -27px;

            filter: drop-shadow(0px 10px 10px rgba(0, 0, 0, 0.15));

            pointer-events: all;

            transition: fill 300ms ease, opacity 160ms ease;

            &.active,
            &.selected,
            &[data-selected="true"] {
                fill: $green;
            }

            &.hidden {
                opacity: 0;
                pointer-events: none;
            }
        }
    }
</style>
