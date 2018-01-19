wmis.mapping = wmis.mapping || {};
wmis.mapping = (function ($) {
    var options = {
        mapElementId: 'map-canvas',
        passStatusFunction: function(pass) {
            return pass.argosPassStatus.key;
        }
    };

    var argosPassStatusToImage = {
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
        11:'/content/images/maps-symbol-x-red.png' //Reject - Invalid
    };

    var argosPassStatusToIsRejected = {
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

    var selectedArgosPassImage = '/content/images/maps-symbol-blank-green.png';

    function ArgosDataViewModel(pointsObservable, selectedPointObservable, reviewPassFunction, map, hideLineAndMarkers) {
        var self = this;
        this.points = pointsObservable;
        this.selectedPoint = selectedPointObservable;

        // The list of existing markers is used and updated by the polyline handler
        // and also used by the selected point handler
        var existingMarkers = null;

        // Handle selected point changing
        (function() {
            var temporaryMarker = null;
            var hiddenMarker = null;
            self.selectedPoint.subscribe(function(newPoint) {
                if (temporaryMarker) {
                    temporaryMarker.setAnimation(null);
                    temporaryMarker.setMap(null);
                    temporaryMarker = null;
                }
                if (hiddenMarker) {
                    hiddenMarker.setMap(map);
                    hiddenMarker = null;
                }
                if (newPoint) {
                    hiddenMarker = _.find(existingMarkers, function(m) {
                        return m.get('pass').key == newPoint.key;
                    });
                    hiddenMarker.setMap(null);
                    // Show a new animated marker
                    temporaryMarker = Markers.createMiddleMarker(map, newPoint, selectedArgosPassImage);
                    temporaryMarker.setMap(map);
                    temporaryMarker.setAnimation(google.maps.Animation.BOUNCE);
                }
            });
        })();

        // Handle the line being updated
        (function() {
            var existingPolyline = null;
            function handleNewPoints (points) {
                points = ko.mapper.toJS(points);
                if (existingPolyline) {
                    existingPolyline.setMap(null);
                    existingPolyline = null;
                }
                if (existingMarkers) {
                    _.forEach(existingMarkers, function(marker) {
                        marker.setMap(null);
                    });
                    existingMarkers = null;
                }
                if (points && points.length > 0) {
                    if (!hideLineAndMarkers) {
                        existingPolyline = Polyline.loadPolyline(map, points);
                        existingMarkers = Markers.loadMarkers(map, points, reviewPassFunction);
                    } else {
                        existingMarkers = Markers.loadMarkersWithoutStartStopIcons(map, points, reviewPassFunction);
                    }
                }
            };
            self.points.subscribe(handleNewPoints);
            handleNewPoints(self.points());
        })();
    }

    var Markers = (function () {

        function createMarker(pass, message, icon) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(pass.latitude, pass.longitude),
                title: message,
                icon: icon
            });
            marker.set('pass', pass);
            return marker;
        }

        function getHoverMessage(pass) {
            return moment(pass.locationDate, moment.ISO_8601).local().format('L h:mm a');
        }

        function createStartMarker(map, pass) {
            return createMarker(pass, "Start: " + getHoverMessage(pass), "/content/images/maps-symbol-blank-start.png");
        }

        function createStopMarker(map, pass) {
            return createMarker(pass, "Stop: " + getHoverMessage(pass), "/content/images/maps-symbol-blank-stop.png");
        }

        function createMiddleMarker(map, pass, imageUrl) {
            imageUrl = imageUrl || argosPassStatusToImage[options.passStatusFunction(pass)];
            return createMarker(pass, getHoverMessage(pass), imageUrl);
        }

        function loadMarkers(map, passes, reviewPassFunction) {
            var markers = [];
            var startPass = passes[0];

            markers.push(createStopMarker(map, startPass));

            var middlePoints = passes.slice(1, -1);
            _.forEach(middlePoints, function (pass) {
                markers.push(createMiddleMarker(map, pass, null));
            });

            var stopPass = passes.length > 1 ? passes[passes.length - 1] : null;
            stopPass && markers.push(createStartMarker(map, stopPass)); 

            _.forEach(markers, function (marker) {
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function () {
                    reviewPassFunction(marker.get('pass'));
                });
            });
            return markers;
        }

        function loadMarkersWithoutStartStopIcons(map, passes, reviewPassFunction) {
            var markers = [];
           
            _.forEach(passes, function (pass) {
                markers.push(createMiddleMarker(map, pass, null));
            });

            _.forEach(markers, function (marker) {
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function () {
                    reviewPassFunction(marker.get('pass'));
                });
            });
            return markers;
        }

        return {
            loadMarkers: loadMarkers,
            loadMarkersWithoutStartStopIcons: loadMarkersWithoutStartStopIcons,
            createMiddleMarker: createMiddleMarker
        }
    })();

    var Polyline = (function () {

        function polyOptionsForPath(path) {
            return {
                path: path,
                strokeColor: '#ff0000',
                strokeOpacity: 1.0,
                strokeWeight: 1
            };
        }

        function loadPolyline(map, passes) {
            var nonRejectedPasses = _.filter(passes, function (pass) {
                var passStatus = options.passStatusFunction(pass);
                 return !argosPassStatusToIsRejected[passStatus];
            });
            var coordinates = _.map(nonRejectedPasses, function (pass) {
                return new google.maps.LatLng(pass.latitude, pass.longitude);
            });
            var pathCoordinates = new google.maps.MVCArray(coordinates);
            var polylineOptions = polyOptionsForPath(pathCoordinates);
            var polyline = new google.maps.Polyline(polylineOptions);

            polyline.setMap(map);
            return polyline;
        }

        return {
            loadPolyline: loadPolyline
        };

    })();

    function createMapInstance() {
        var mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng(64.918325, -118.002385),
            scaleControl: true
        };

        return new google.maps.Map(document.getElementById(options.mapElementId), mapOptions);
    }

    function initialize(pointsObservable, selectedPointObservable, reviewPassFunction, passStatusFunction, mapElementId, hideLineAndMarkers) {
        options.mapElementId = mapElementId || options.mapElementId;

        if (typeof (passStatusFunction) != 'undefined' && passStatusFunction != null) {
            options.passStatusFunction = passStatusFunction;
        }
        var map = createMapInstance();
        var argosDataViewModel = new ArgosDataViewModel(pointsObservable, selectedPointObservable, reviewPassFunction, map, hideLineAndMarkers);

        return map;
    }
    
    return {
        initialize: initialize
    };
}(jQuery));