wmis.collaredanimal = wmis.collaredanimal || {};
wmis.collaredanimal.mapping = (function ($) {
    var options = {
        collaredAnimalId: null
    };

    function saveArgosPass(pass) {
        var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
        return $.ajax({
            url: "/api/argos/pass/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                argosPassId: pass.argosPassId,
                argosPassStatusId: pass.argosPassStatusId,
                comment: pass.comment
            })
        }).done(function() {
            $("#locationTable").DataTable().ajax.reload(null, false);
        }).always(function () {
            wmis.global.hideWaitingScreen(waitingScreenId);
        }).fail(wmis.global.ajaxErrorHandler);
    }

    function setHighlightRowForKey(key, enable) {
        var row = $("#locationTable").DataTable().rows(function (idx, data, node) {
            return data.key == key;
        });
        if (enable) {
            $(row.nodes()).addClass('highlightPassRow');
        } else {
            $(row.nodes()).removeClass('highlightPassRow');
        }
    }

    function LocationTableModel() {
        var self = this;
        this.argosPasses = ko.observableArray();
        this.selectedPass = ko.observable();

        this.passStatuses = ko.observableArray();
        this.statusFilterKey = ko.observable(-1);
        this.daysFilterKey = ko.observable(-1);

        this.showGpsOnly = ko.observable(true);

        this.statusFilterOptions = [
            { key: -1, name: 'All' },
            { key: 0, name: 'Warnings' },
            { key: 1, name: 'Rejected' }
        ];

        this.daysFilterOptions = [
            { key: -1, name: 'All' },
            { key: 7, name: 'Last Week' },
            { key: 30, name: 'Last Month' },
            { key: 90, name: 'Last Quarter' }
        ];

        wmis.global.getDropDownData(self.passStatuses, "/api/argos/passStatuses?startRow=0&rowCount=500", function (result) { return result.data; });

        this.highlightPass = function(pass) {
            self.selectedPass(pass);
        }

        this.reviewPass = function(pass) {
            self.selectedPass(pass);
            wmis.collaredanimal.editmodals.reviewCollarDataPoint(
                pass,
                self.passStatuses,
                function(updatedPass) {
                    saveArgosPass(updatedPass);
                },
                function() {
                    self.selectedPass(null);
                }
            );
        };

        // Handle highlighting the selected row
        (function () {
            var currentKey = null;
            self.selectedPass.subscribe(function (newPass) {
                if (currentKey) {
                    setHighlightRowForKey(currentKey, false);
                    currentKey = null;
                }
                if (newPass) {
                    currentKey = newPass.key;
                    setHighlightRowForKey(currentKey, true);
                }
            });
        })();

        this.fetchFromArgos = function () {
            wmis.global.showWaitingScreen("Pulling Argos Data...");
            $.ajax({
                url: "/api/argos/run/" + options.collaredAnimalId,
                type: "POST",
            }).success(function() {
                console.log("sucess!");
                $("#locationTable").DataTable().ajax.reload(null, true);
            }).always(function() {
                wmis.global.hideWaitingScreen();
            }).fail(wmis.global.ajaxErrorHandler);
        }

        this.downloadShapeFile = function () {
            window.open("/api/argos/passesShapeFile?startRow=0&rowCount=20000&collaredAnimalId=" + options.collaredAnimalId, '_self');
        }

        this.downloadKmlFile = function () {
            window.open("/api/argos/passesKmlFile?startRow=0&rowCount=20000&collaredAnimalId=" + options.collaredAnimalId, '_self');
        }
        // export as excel
        this.downloadExcelFile = function () {
            window.open("/api/argos/passesExcelFile?startRow=0&rowCount=200000&collaredAnimalId=" + options.collaredAnimalId, '_self');
        }
    }

    function loadPassesTable(locationTableModel) {
        ko.renderTemplate(
                     'passTableFilterTemplate',
                     locationTableModel,
                     {},
                     document.getElementById('locationTableFilter'),
                     "replaceNode"
                 );

        $("#locationTable").DataTable({
            "iDisplayLength": 100,
            "ordering": false,
            "bJQueryUI": true,
            "responsive": true,
            "scrollY": "500px",
            "scrollCollapse": true,
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
                        var date = moment(data, moment.ISO_8601).local().format('L h:mm a');
                        return date;
                    }
                },
                { "data": "latitude" },
                { "data": "longitude" },
                { "data": "locationClass" },
                { "data": "cepRadius" },
                { "data": "argosPassStatus.name" },
                { "data": "comment" },
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
                    collaredAnimalId: options.collaredAnimalId,
                };
                //Check Status Filter
                var statusFilterValue = locationTableModel.statusFilterKey();
                if (statusFilterValue >= 0) parameters.statusFilter = statusFilterValue;
                //Check Days Filter
                var daysFilterValue = locationTableModel.daysFilterKey();
                if (daysFilterValue >= 0) parameters.daysFilter = daysFilterValue;
                //Check GPS Filter
                var showGpsOnlyValue = locationTableModel.showGpsOnly();
                if (showGpsOnlyValue) parameters.showGpsOnly = showGpsOnlyValue;
               

                $.getJSON("/api/argos/passes", parameters, function (json) {
                    locationTableModel.argosPasses(json.data);
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
            locationTableModel.reviewPass(rowData);
        });

        $("#locationTable").on('click', 'td', function (event) {
            //TODO: Get jonah to review cause this feels kinda like a hack
            var row_clicked = $(event.target).closest('tr');
            var rowData = $("#locationTable").DataTable().row(row_clicked).data();
            locationTableModel.highlightPass(rowData);
        });

        locationTableModel.statusFilterKey.subscribe(function () {
            $("#locationTable").DataTable().ajax.reload();
        });

        locationTableModel.daysFilterKey.subscribe(function () {
            $("#locationTable").DataTable().ajax.reload();
        });
        // GPS Checkbox Clicked
        locationTableModel.showGpsOnly.subscribe(function() {
            $("#locationTable").DataTable().ajax.reload();
        });
    }


    function initializeMap(collaredAnimalId) {
        options.collaredAnimalId = collaredAnimalId;
        var locationTableModel = new LocationTableModel();
        wmis.mapping.initialize(locationTableModel.argosPasses, locationTableModel.selectedPass, locationTableModel.highlightPass, null, false);
        
        loadPassesTable(locationTableModel);
	}

	return {
	    initializeMap: _.once(initializeMap)
	};
}(jQuery));