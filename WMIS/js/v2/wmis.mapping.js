class WMISMapping {
    options = {
        mapElementId: 'map-canvas',
        passStatusFunction: function (pass) {
            return pass.argosPassStatus.key;
        }
    }

    map = null;

    argosPassStatusToImage = {
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
    };

    argosPassStatusToIsRejected = {
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

    selectedArgosPassImage = '/content/images/maps-symbol-blank-green.png';


    _createMapInstance() {
        let mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng(64.918325, -118.002385),
            scaleControl: true
        };

        return new google.maps.Map(document.getElementById(this.options.mapElementId), mapOptions);
    }

    init(points, mapElementId) {
        this.options.mapElementId = mapElementId || this.options.mapElementId;
        console.log(points)
        this.map = this._createMapInstance();

        return this.map;
    }
    
}