wmis.collaredanimal = wmis.collaredanimal || {};
wmis.collaredanimal.mapping = (function ($) {
    var options = {
        mapElementId: 'map-canvas'
    };

    var argosPassStatusToImage = {
        0: '/content/images/maps-symbol-blank-red.png', //Null status
        1: '/content/images/maps-symbol-x-red.png', //Reject - Impassable Terrain
        2: '/content/images/maps-symbol-x-red.png', //Reject - Location in Water
	    3: '/content/images/maps-symbol-x-red.png', //Reject - Unusual Movement
	    4: '/content/images/maps-symbol-blank-yellow.png', //Warning - Fast Mover
	    5: '/content/images/maps-symbol-blank-yellow.png', //Warning - Suspected Error
	    6: '/content/images/maps-symbol-blank-yellow.png', //Warning - Unexpected Reports
	    7: '/content/images/maps-symbol-blank-orange.png' //Warning - Possibly Stationary
    };

    var selectedArgosPassImage = '/content/images/maps-symbol-blank-green.png';

    function saveArgosPass(pass) {
        var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
        return $.ajax({
            url: "/api/argos/pass/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                argosPassId: pass.argosPassId,
                argosPassStatusId: pass.argosPassStatusId
            })
        }).done(function() {
            $("#locationTable").DataTable().ajax.reload(null, false);
        }).always(function () {
            wmis.global.hideWaitingScreen(waitingScreenId);
        }).fail(wmis.global.ajaxErrorHandler);
    }

    function setHighlightRowForPass(pass, enable) {
        var row = $("#locationTable").DataTable().rows(function (idx, data, node) {
            return data.key == pass.key;
        });
        if (enable) {
            $(row.nodes()).addClass('highlightPassRow');
        } else {
            $(row.nodes()).removeClass('highlightPassRow');
        }
    }

    function ArgosDataViewModel(collaredAnimalKey, map) {
        var self = this;
        this.argosPasses = ko.observableArray();
        this.passStatuses = ko.observableArray();

        this.statusFilterKey = ko.observable(-1);
        
        this.statusFilterOptions = [
            { key: '-1', name: 'All' },
            { key: '0', name: 'Warnings' },
            { key: '1', name: 'Rejected' }
        ];

        wmis.global.getDropDownData(self.passStatuses, "/api/argos/passStatuses?startRow=0&rowCount=500", function (result) { return result.data; });

        var existingPolyline = null;
        var existingMarkers = null;

        this.reviewPass = function (pass) {
            // Hide the existing marker
            var existingMarker = _.find(existingMarkers, function(m) {
                return m.get('pass').key == pass.key;
            });
            existingMarker.setMap(null);
            // Show a new animated marker
            var temporaryMarker = Markers.createMiddleMarker(map, pass, selectedArgosPassImage);
            temporaryMarker.setMap(map);
            temporaryMarker.setAnimation(google.maps.Animation.BOUNCE);

            setHighlightRowForPass(pass, true);

            wmis.collaredanimal.editmodals.reviewCollarDataPoint(
                pass,
                self.passStatuses,
                function (updatedPass) {
                    saveArgosPass(updatedPass);
                },
                function () {
                    temporaryMarker.setAnimation(null);
                    temporaryMarker.setMap(null);
                    existingMarker.setMap(map);
                    setHighlightRowForPass(pass, false);
                }
            );
        }

        ko.computed(function () {
            var passes = self.argosPasses();
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
            if (passes.length > 0) {
                existingPolyline = Polyline.loadPolyline(map, passes);
                existingMarkers = Markers.loadMarkers(map, passes, self.reviewPass);
            }
        });

        this.fetchFromArgos = function () {
            // TODO dont do this by name, use the collaredAnimalId
            wmis.global.showWaitingScreen("Pulling Argos Data...");
            $.ajax({
                url: "/api/argos/run/" + collaredAnimalKey,
                type: "POST",
            }).success(function() {
                console.log("sucess!");
                $("#locationTable").DataTable().ajax.reload(null, true);
            }).always(function() {
                wmis.global.hideWaitingScreen();
            }).fail(wmis.global.ajaxErrorHandler);
        }
    }

    function loadPassesTable(collaredAnimalKey, argosDataViewModel) {
        ko.renderTemplate(
                     'passTableFilterTemplate',
                     argosDataViewModel,
                     {},
                     document.getElementById('locationTableFilter'),
                     "replaceNode"
                 );

        $("#locationTable").DataTable({
            "iDisplayLength": 10,
            "ordering": false,
            "bJQueryUI": true,
            "bProcessing": true,
            "pagingType": "bootstrap",
            "serverSide": true,
            "dom": '<"top">rt<"bottom"ip><"clear">',
            "createdRow": function (row, data, dataIndex) {
                var hasPassStatus = data.argosPassStatus.key > 0;
                var isRejected = data.argosPassStatus.isRejected;
                if (hasPassStatus && !isRejected) {
                    $(row).addClass( 'warning-status' );
                } else if (hasPassStatus && isRejected) {
                    $(row).addClass('rejected-status');
                }
            },
            "columns": [
                {
                    "data": "locationDate",
                    "render": function(data, type, row) {
                        var date = moment.utc(data, moment.ISO_8601).local().format('L h:mm a');
                        return date;
                    }
                },
                { "data": "latitude" },
                { "data": "longitude" },
                { "data": "argosPassStatus.name" },
                {
                    "data": null,
                    "width": "40px",
                    "className": "editHistory",
                    "render": function(data, type, row, meta) {
                        return '<span class="glyphicon glyphicon-edit" data-row-index="' + meta.row + '"/>';
                    }
                }
            ],
            searching: true,
            "ajax": function(data, callback, settings) {
                
                var parameters = {
                    // Data Tables parameter transforms
                    startRow: data.start,
                    rowCount: data.length,
                    collaredAnimalId: collaredAnimalKey,
                };
                var statusFilterValue = argosDataViewModel.statusFilterKey();
                if (statusFilterValue >= 0) parameters.statusFilter = statusFilterValue;

                $.getJSON("/api/argos/passes", parameters, function (json) {
                    argosDataViewModel.argosPasses(json.data);
                    var result = {
                        data: json.data,
                        draw: data.draw,
                        recordsTotal: json.resultCount,
                        recordsFiltered: json.resultCount
                    };
                    callback(result);
                });
            },
        });

        $("#locationTable").on('click', 'td.editHistory span', function (event) {
            var rowIndex = $(event.target).data().rowIndex;
            var rowData = $("#locationTable").DataTable().row(rowIndex).data();
            argosDataViewModel.reviewPass(rowData);
        });

        argosDataViewModel.statusFilterKey.subscribe(function () {
            $("#locationTable").DataTable().ajax.reload();
        });
    }

    var Markers = (function() {

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
            return pass.latitude + ", " + pass.longitude;
        }

        function createStartMarker(map, pass) {
            return createMarker(pass, "Start: " + getHoverMessage(pass), "/content/images/maps-symbol-blank-start.png");
        }

        function createStopMarker(map, pass) {
            return createMarker(pass, "Stop" + getHoverMessage(pass), "/content/images/maps-symbol-blank-stop.png");
        }

        function createMiddleMarker(map, pass, imageUrl) {
            imageUrl = imageUrl || argosPassStatusToImage[pass.argosPassStatus.key];
            return createMarker(pass, getHoverMessage(pass), imageUrl);
        }

        function loadMarkers(map, passes, reviewPassFunction) {
            var markers = [];
            var startPass = passes[0];
            markers.push(createStartMarker(map, startPass));

            var middlePoints = passes.slice(1, -1);
            _.forEach(middlePoints, function (pass) {
                markers.push(createMiddleMarker(map, pass));
            });

            var stopPass = passes.length > 1 ? passes[passes.length - 1] : null;
            stopPass && markers.push(createStopMarker(map, stopPass));

            _.forEach(markers, function(marker) {
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function() {
                    reviewPassFunction(marker.get('pass'), map);
                });
            });
            return markers;
        }

        return {
            loadMarkers: loadMarkers,
            createMiddleMarker: createMiddleMarker
        }
    })();

    var Polyline = (function() {

        function polyOptionsForPath(path) {
            return {
                path: path,
                strokeColor: '#ff0000',
                strokeOpacity: 1.0,
                strokeWeight: 1
            };
        }
        
        function loadPolyline(map, passes) {
            var nonRejectedPasses = _.filter(passes, function (pass) { return !pass.argosPassStatus.isRejected; });
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
            center: new google.maps.LatLng(64.918325, -118.002385)
        };

        return new google.maps.Map(document.getElementById(options.mapElementId), mapOptions);
    }

    function initializeMap(collaredAnimalId) {
        var map = createMapInstance();
        var argosDataViewModel = new ArgosDataViewModel(collaredAnimalId, map);
        loadPassesTable(collaredAnimalId, argosDataViewModel);
	}

    var mapTabClicked = (function() {
        var initialized = false;
        return function(collaredAnimalKey) {
            if (!initialized) {
                initialized = true;
                initializeMap(collaredAnimalKey);
            }
        }
    })();

	return {
	    mapTabClicked: mapTabClicked
	};
}(jQuery));