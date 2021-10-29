const argosPassStatusToImage = {
    0: '/content/images/maps-symbol-blank-red.png', //Null status
    1: '/content/images/maps-symbol-x-red.png', //Reject - Impassable Terrain
    2: '/content/images/maps-symbol-x-red.png', //Reject - Location in Water
    3: '/content/images/maps-symbol-x-red.png', //Reject - Unusual Movement
    4: '/content/images/maps-symbol-blank-yellow.png', //Warning - Fast Mover
    5: '/content/images/maps-symbol-blank-yellow.png', //Warning - Suspected Error
    6: '/content/images/maps-symbol-blank-yellow.png', //Warning - Unexpected Reports
    7: '/content/images/maps-symbol-blank-yellow.png', //Warning - Possibly Stationary
    8: '/content/images/maps-symbol-blank-yellow.png', //Good  - Without Warnings or rejections
    9: '/content/images/maps-symbol-x-red.png', //Reject - Unusual Mortality
    10: '/content/images/maps-symbol-x-red.png', //Reject - Released Collar
    11: '/content/images/maps-symbol-x-red.png' //Reject - Invalid
}

const selectedArgosPassImage = '/content/images/maps-symbol-blank-green.png';

const Loader = google.maps.plugins.loader.Loader;

const mapLoader = new Loader({
    apiKey: "AIzaSyAPbVsrzI2t37hJOZKAo1bqpCu3khl14kM",
    version: "weekly",
    libraries: ["places"]
});



const GoogleMap = {
    components: {
        PolyLine
    },
    template: `
        <div class="google-map" id="map-canvas" ref="googleMap"></div>
        <template v-if="Boolean(this.map)">
            <poly-line
                v-if="hasPolyline"
                :passes="passes"
                :map="map"
                :google="google"
                :passStatusFunction="passStatusFunction"></poly-line>    
        </template>
        </div>
    `,

    props: {
        passes: {
            type: Array,
            required: true
        },
        passStatusFunction: {
            type: Function,
            default: (pass) => pass.argosPassStatus.key || 0
        },
        hasPolyline: {
            type: Boolean,
            default: false
        },
        selectedPass: {
            type: Object,
            required: false
        }
    },

    data: function() {
        return {
            map: null,
            google: null,
            mapOptions: {
                zoom: 8,
                center: { lat: 64.918325, lng: -118.002385 },
                scaleControl: true,
                streetViewControl: false,
                mapTypeId: "terrain"
            },

            markers: [],
            temporaryMarker: null,
            hiddenMarker: null
        }
    },

    watch: {
        passes: {
            deep: true,
            immediate: false,
            handler: function(passes) {
                if (this.map) {
                    this.markers.forEach(m => {
                        m.setVisible(false);
                        m.setMap(null);
                    });
                    this.markers = [];
                    this.loadMarkers()
                }
            }
        },

        selectedPass: {
            deep: true,
            handler: function(selectedPass) {
                
                if (this.temporaryMarker) {
                    this.temporaryMarker.setAnimation(null);
                    if (selectedPass) {
                        this.temporaryMarker.setVisible(false);
                    } else {
                        this.temporaryMarker.setIcon(argosPassStatusToImage[this.passStatusFunction(this.temporaryMarker.get('pass'))])
                    }
                    this.temporaryMarker.setMap(null);
                    this.temporaryMarker = null;
                }

                if (this.hiddenMarker) {
                    this.hiddenMarker.setVisible(true);
                    this.hiddenMarker.setMap(this.map);
                    this.hiddenMarker = null;
                }

                if (selectedPass) {
                    this.hiddenMarker = this.markers.find(m => m.get('pass').key == selectedPass.key);
                    this.hiddenMarker.setVisible(false);
                    this.hiddenMarker.setMap(null);

                    // Show a new animated marker
                    this.temporaryMarker = this.createMiddleMarker(selectedPass, selectedArgosPassImage);
                    this.temporaryMarker.setVisible(true);
                    this.temporaryMarker.setMap(this.map);
                    this.temporaryMarker.setAnimation(this.google.maps.Animation.BOUNCE);
                }


            }
        }
    },

    methods: {
        initializeMap: function() {
            const mapContainer = this.$refs.googleMap;
            mapLoader.loadCallback(e => {
                if (e) {
                    console.log(e)
                } else {
                    this.google = google;
                    this.map = new this.google.maps.Map(mapContainer, this.mapOptions);
                }
            })
        },

        createMarker: function(pass, message, icon) {
            let marker = new this.google.maps.Marker({
                position: new google.maps.LatLng(pass.latitude, pass.longitude),
                title: message,
                icon: icon
            });
            marker.set('pass', pass);
            return marker;
        },

        getHoverMessage: function(pass) {
            return moment(pass.locationDate || pass.timestamp, moment.ISO_8601).local().format('L h:mm a');
        },

        createStartMarker: function(pass) {
            return this.createMarker(pass, "Start: " + this.getHoverMessage(pass), "/content/images/maps-symbol-blank-start.png");
        },

        createStopMarker: function(pass) {
            return this.createMarker(pass, "Stop: " + this.getHoverMessage(pass), "/content/images/maps-symbol-blank-stop.png");
        },
        createMiddleMarker: function(pass, imageUrl) {
            imageUrl = imageUrl || argosPassStatusToImage[this.passStatusFunction(pass)];
            return this.createMarker(pass, this.getHoverMessage(pass), imageUrl);
        },

        loadMarkers: function() {
            let startPass = this.passes[0];
            if (startPass) {
                this.markers.push(this.createStopMarker(startPass));
            }
            let middlePoints = this.passes.slice(1, -1);

            middlePoints.forEach(p => {
                this.markers.push(this.createMiddleMarker(p, null))
            });

            let stopPass = this.passes.length > 1 ? this.passes[this.passes.length - 1] : null;

            if (stopPass) {
                this.markers.push(this.createStartMarker(stopPass));
            }

            this.markers.forEach(m => {
                m.setMap(this.map);
                this.google.maps.event.addListener(m, 'click', () => {
                    this.$emit("is:selected", m.get('pass'))
                });
            });

            this.setMapCenter()
        },

        loadObservations: function () {
            console.log(this.passes)
            this.passes.forEach(p => {
                this.markers.push(this.createMiddleMarker(p, null))
            });

            this.markers.forEach(m => {
                m.setMap(this.map);
                this.google.maps.event.addListener(m, 'click', () => {
                    this.$emit("is:selected", m.get('pass'))
                });
            });

            this.setMapCenter()
        },

        setMapCenter: function () {
            if (this.passes && this.passes.length > 0) {
                const sumLng = this.passes.map(p => p.longitude).reduce((a, b) => a + b, 0);
                const sumLat = this.passes.map(p => p.latitude).reduce((a, b) => a + b, 0);

                const avgLng = (sumLng / this.passes.length) || -118.002385;
                const avgLat = (sumLat / this.passes.length) || 64.918325;

                this.map.setCenter({ lat: avgLat, lng: avgLng })
            }
        }
    },

    mounted: async function () {
        await this.initializeMap()
        setTimeout(() => {
            if (this.passes && this.passes.length > 0) {
                if (this.hasPolyline) {
                    this.loadMarkers();
                } else {
                    this.loadObservations();
                }
            }
        }, 1000)
        
        
    }

}