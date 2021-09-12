/*

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

const MapMarker = {
    props: ['map', 'google', 'pass', 'selected', 'passStatusFunction'],

    template: '<span></span>',

    data() {
        return {
            marker: null,
        }
    },

    watch: {
        pass: {
            deep: true,
            handler(pass) {
                this.marker.setIcon(this.getIcon())
            }
        },

        selected: {
            deep: true,
            handler(selectedPass) {
                if (selectedPass && this.pass.key == selectedPass.key) {
                    this.marker.setIcon(selectedArgosPassImage);
                    this.marker.setAnimation(this.google.maps.Animation.BOUNCE);
                } else {
                    this.marker.setIcon(this.getIcon());
                    this.marker.setAnimation(null);
                }
            }
        }
    },

    computed: {
        isSelected() {
            if (!this.selectedPass) return false;
            return this.selectedPass.key == this.pass.key;
        }
    },

    methods: {
        createMarker() {
            this.marker = new this.google.maps.Marker({
                position: { lat: this.pass.latitude, lng: this.pass.longitude },
                title: this.getHoverMessage(),
                icon: this.getIcon()
            });
            this.marker.set('pass', this.pass);
            this.marker.setMap(this.map);

            this.google.maps.event.addListener(this.marker, 'click', () => {
                this.$emit("is:selected", this.pass)
            });
        },

        getHoverMessage() {
            return moment(this.pass.locationDate || this.pass.timestamp, moment.ISO_8601).local().format('L h:mm a');
        },

        getIcon() {
            if (this.isSelected) {
                return selectedArgosPassImage;
            }
            if (this.pass.isFirstPass) {
                return "/content/images/maps-symbol-blank-start.png";
            }

            if (this.pass.isLastPass) {
                return "/content/images/maps-symbol-blank-stop.png";
            }

            return argosPassStatusToImage[this.passStatusFunction(this.pass)]
        }   
    },

    mounted() {
        this.createMarker()
    },

    
}
*/
