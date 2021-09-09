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

const argosPassStatusToIsRejected = {
    0: false, //Null status
    1: true, //Reject - Impassable Terrain
    2: true, //Reject - Location in Water
    3: true, //Reject - Unusual Movement
    4: false, //Warning - Fast Mover
    5: false, //Warning - Suspected Error
    6: false, //Warning - Unexpected Reports
    7: false, //Warning - Possibly Stationary
    8: false, //Good  - Without Warnings or rejections
    9: true, //Reject - Mortality
    10: true, //Reject - Released Collar
    11: true //Reject - Invalid
};

const selectedArgosPassImage = '/content/images/maps-symbol-blank-green.png';

const GMap = {
    template: `<div class="card" id="map-canvas"></div>`,
    props: {
        points: {
            type: Array,
            required: false
        },
        passStatusFunction: {
            type: Function,
            default: (pass) => pass.argosPassStatus.key || 0
        },
        hideLines: {
            type: Boolean,
            default: false
        },
        selectedPass: {
            type: [Object],
            required: false
        }
    },
    emits: ['point:selected'],

    data() {
        return {
            mapOptions: {
                zoom: 5,
                center: new google.maps.LatLng(64.918325, -118.002385),
                scaleControl: true
            },
            temporaryMarker: null,
            hiddenMarker: null,
            markers: null,
            polyline: null,
            map: null
        }
    },

    watch: {
        selectedPass: {
            deep: true,
            immediate:true,
            handler(newPoint) {
                this.clearAnimations();

                if (newPoint) {
                    const selectedMarker = this.markers.find(m => m.get('pass').key == newPoint.key)

                    if (this.markers) {
                        for (const m of this.markers) {
                            m.setIcon(this.getIconFromIndex(m.get('pass')))
                        }
                    }

                    selectedMarker.setAnimation(google.maps.Animation.BOUNCE)
                    selectedMarker.setIcon(selectedArgosPassImage)

                    this.temporaryMarker = selectedMarker;
                } else {
                    if (this.markers) {
                        for (const m of this.markers) {
                            m.setIcon(this.getIconFromIndex(m.get('pass')))
                        }
                    }
                }
            }
        },

        points: {
            deep: true,
            handler(newPoints) {
                if (this.points && this.points.length > 0) {
                    this.clearAnimations();
                    if (this.hideLines) {
                        this.loadMarkersWithoutStartStopIcons()
                    } else {
                        this.loadPolyline()
                        this.loadMarkers()
                    }
                }
            }
        }
    },

    methods: {
        clearAnimations() {
            if (!this.markers) return;
            this.markers.forEach(m => {
                m.setAnimation(null);
            })
        },

        getIconFromIndex(pass) {
            const locIndex = this.markers.findIndex(m => m.get('pass').key == pass.key);

            let icon = argosPassStatusToImage[this.passStatusFunction(pass)];

            // last location icon
            if (locIndex == 0) {
                icon = "/content/images/maps-symbol-blank-stop.png";
            }

            // first location marker
            if (locIndex == (this.points.length - 1)) {
                icon = "/content/images/maps-symbol-blank-start.png";
            }

            return icon;
        },

        getCenter() {
            const lat = this.points.reduce((total, next) => total + next.latitude, 0) / this.points.length;
            const lng = this.points.reduce((total, next) => total + next.longitude, 0) / this.points.length;
            return {
                lat, lng
            };
        },

        createMapInstance() {
            const center = this.getCenter();
            this.mapOptions.center = new google.maps.LatLng(center.lat, center.lng)
            return new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);
        },

        loadMarkersWithoutStartStopIcons() {
            if (this.markers) {
                for (const marker of this.markers) {
                    marker.setMap(null)
                }
                this.markers = null
            }

            let markers = []
            for (const pass of this.points) {
                markers.push(this.createMiddleMarker(pass, null));
            }

            for (const marker of markers) {
                marker.setMap(this.map);
                google.maps.event.addListener(marker, 'click', () => {
                    this.$emit("point:selected", marker.get('pass'))
                });
            }

            this.markers = markers;
        },

        loadMarkers() {
            if (this.markers) {
                for (const marker of this.markers) {
                    marker.setMap(null)
                }
                this.markers = null
            }

            let markers = [];
            let startPass = this.points[0];
            markers.push(this.createStopMarker(startPass))
            
            let middlePoints = this.points.slice(1, -1);

            for (const point of middlePoints) {
                markers.push(this.createMiddleMarker(point, null))
            }

            let stopPass = this.points.length > 1 ? this.points[this.points.length - 1] : null;
            
            if (stopPass) {
                markers.push(this.createStartMarker(stopPass));
            }

            for (const marker of markers) {
                marker.setMap(this.map);
                google.maps.event.addListener(marker, 'click', () => {
                    this.$emit("point:selected", marker.get('pass'))
                })
            }

            this.markers = markers;
        },

        getHoverMessage(pass) {
            return moment(pass.locationDate || pass.timestamp, moment.ISO_8601).local().format('L h:mm a');
        },

        createStartMarker(pass) {
            return this.createMarker(pass, "Start: " + this.getHoverMessage(pass), "/content/images/maps-symbol-blank-start.png");
        },

        createStopMarker(pass) {
            return this.createMarker(pass, "Stop: " + this.getHoverMessage(pass), "/content/images/maps-symbol-blank-stop.png");
        },

        createMiddleMarker(pass, imageUrl) {
            imageUrl = imageUrl || argosPassStatusToImage[this.passStatusFunction(pass)];
            return this.createMarker(pass, this.getHoverMessage(pass), imageUrl);
        },

        createMarker(pass, message, icon) {
            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(pass.latitude, pass.longitude),
                title: message,
                icon: icon
            });
            marker.set('pass', pass);
            return marker;
        },

        polyOptionsForPath(path) {
            return {
                path: path,
                strokeColor: '#ff0000',
                strokeOpacity: 1.0,
                strokeWeight: 1
            };
        },

        loadPolyline() {
            if (this.polyline) {
                this.polyline.setMap(null);
                this.polyline = null;
            }

            const nonRejectedPasses = this.points.filter(pass =>  {
                const passStatus = this.passStatusFunction(pass);
                return !argosPassStatusToIsRejected[passStatus];
            });

            const coordinates = nonRejectedPasses.map(pass => new google.maps.LatLng(pass.latitude, pass.longitude))

            var pathCoordinates = new google.maps.MVCArray(coordinates);
            var polylineOptions = this.polyOptionsForPath(pathCoordinates);
            var polyline = new google.maps.Polyline(polylineOptions);
            polyline.setMap(this.map);

            this.polyline = polyline;
        },

        init() {
            this.map = this.createMapInstance()
            if (this.points && this.points.length > 0) {
                if (this.hideLines) {
                    this.loadMarkersWithoutStartStopIcons()
                } else {
                    this.loadPolyline()
                    this.loadMarkers()
                }
            }
            
        }
    },


    mounted() {
        this.init()
    }




}