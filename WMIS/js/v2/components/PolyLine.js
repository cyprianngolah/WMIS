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

const PolyLine = {
    props: ['map', 'google', 'passes',  'passStatusFunction'],

    data: function() {
        return {
            polyline: null,
        }
    },

    watch: {
        passes: {
            deep: true,
            handler: function(passes) {
                this.polyline.setPath(this.getPathCoordinates())
            }
        }
    },

    methods: {
        loadPolyline: function() {
            const pathCoordinates = this.getPathCoordinates();
            const polylineOptions = this.polyOptionsForPath(pathCoordinates);
            this.polyline = new this.google.maps.Polyline(polylineOptions);
            this.polyline.setMap(this.map);
        },


        getPathCoordinates: function() {
            const nonRejectedPasses = this.passes.filter(p => {
                const passStatus = this.passStatusFunction(p);
                return !argosPassStatusToIsRejected[passStatus];
            })

            const coordinates = nonRejectedPasses.map(p => {
                return new this.google.maps.LatLng(p.latitude, p.longitude);
            });

            return new this.google.maps.MVCArray(coordinates);

        },

        polyOptionsForPath: function(path) {
            return {
                path: path,
                strokeColor: '#ff0000',
                strokeOpacity: 1.0,
                strokeWeight: 1
            }
        }
    },

    mounted: function() {
        this.loadPolyline()
    }
}