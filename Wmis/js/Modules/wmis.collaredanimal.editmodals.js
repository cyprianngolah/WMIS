wmis.collaredanimal = wmis.collaredanimal || {};
wmis.collaredanimal.editmodals = (function ($) {
    function CollarDataPointViewModel(point) {
        var self = this;
        this.latitude = 'Latitude:' + point.latitude;
        this.longitude = 'Longitude:' + point.longitude;
        this.date = 'Date:' + point.locationDate;
        this.acquiredTime = 'Acquired Time: ' + point.locationDate;
        this.saveAllowed = ko.observable(true);
        this.save = function () {
            self.modal.close('success');
        }
        this.cancel = function () {
            self.modal.close();
        }
    };

    function ArgosDataViewModel(collaredAnimalKey, collar) {
        function reviewCollarDataPoint(collarDataPoint) {
            var viewModel = new CollarDataPointViewModel(collarDataPoint);

            wmis.global.showModal({
                viewModel: viewModel,
                context: this,
                template: 'collarDataPointTemplate'
            }).done(function (result) {
                console.log("Modal closed with result: " + result);
            })
                .fail(function () {
                    console.log("Modal cancelled");
                });
        }

        var self = this;
        var argosPasses = ko.observableArray();

        // Load the map the first time the tab is clicked
        var mapTabClicked = ko.observable(false);
        this.loadMap = function () {
            mapTabClicked(true);
        }
        ko.computed(function () {
            if (mapTabClicked()) wmis.collaredanimal.mapping.initializeMap(collaredAnimalKey, 'map-canvas', argosPasses, reviewCollarDataPoint);
        });

        // Call the argos webservice to fetch new collar data
        this.getArgosCollarData = function () {
            // TODO dont do this by name, use the collaredAnimalId
            wmis.global.showWaitingScreen("Pulling Argos Data...");
            $.ajax({
                url: "/api/argos/run/" + collar().collarId(),
                type: "POST",
            }).success(function () {
                console.log("sucess!");
            }).always(function () {
                wmis.global.hideWaitingScreen();
            }).fail(wmis.global.ajaxErrorHandler);
        };

        // Populate the initial passes
        //        $.getJSON("/api/argos/passes?collaredAnimalId= " + collaredAnimalKey + "&startRow=0&rowCount=500", function (result) {
        //            argosPasses(result.data);
        //        });

        $("#locationTable").DataTable({
            "iDisplayLength": 2,
            "ordering": false,
            "bJQueryUI": true,
            "bProcessing": true,
            "pagingType": "bootstrap",
            "serverSide": true,
            "dom": '<"top">rt<"bottom"ip><"clear">',
            "columns": [
                {
                    "data": "locationDate",
                    "render": function (data, type, row) {
                        var date = moment.utc(data, moment.ISO_8601).local().format('L h:mm a');
                        return date;
                    }
                },
                { "data": "latitude" },
                { "data": "longitude" },
                {
                    "data": null,
                    "width": "40px",
                    "className": "editHistory",
                    "render": function (data, type, row, meta) {
                        return '<span class="glyphicon glyphicon-edit" data-row-index="' + meta.row + '"/>';
                    }
                }
            ],
            searching: false,
            "ajax": function (data, callback, settings) {
                var parameters = {
                    // Data Tables parameter transforms
                    startRow: data.start,
                    rowCount: data.length,
                    collaredAnimalId: collaredAnimalKey,
                };
                $.getJSON("/api/argos/passes", parameters, function (json) {
                    argosPasses(json.data);
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
            ko.mapper.fromJS(rowData, {}, self.selectedCollarHistory);
            $('#editHistoryCommentModal').modal('show');
            console.log(event);
        });
    }

    function DropdownViewModel() {
        var self = this;
        this.collarTypes = ko.observableArray();
        this.collarRegions = ko.observableArray();
        this.collarStatuses = ko.observableArray();
        this.collarMalfunctions = ko.observableArray();
        this.collarStates = ko.observableArray();
        this.animalSexes = ko.observableArray();
        this.breedingStatusMethods = ko.observableArray();
        this.breedingStatuses = ko.observableArray();
        this.confidenceLevels = ko.observableArray();
        this.herdAssociationMethods = ko.observableArray();
        this.herdPopulations = ko.observableArray();
        this.ageClasses = ko.observableArray();
        this.animalMortalities = ko.observableArray();
        this.animalStatuses = ko.observableArray();

        wmis.global.getDropDownData(self.collarTypes, "/api/collar/type?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.collarRegions, "/api/collar/region?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.collarStatuses, "/api/collar/status?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.collarStates, "/api/collar/state?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.collarMalfunctions, "/api/collar/malfunction?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.animalSexes, "/api/collar/animalSexes?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.breedingStatusMethods, "/api/collar/breedingStatusMethods?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.breedingStatuses, "/api/collar/breedingStatuses?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.confidenceLevels, "/api/collar/confidenceLevels?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.herdAssociationMethods, "/api/collar/herdAssociationMethods?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.herdPopulations, "/api/collar/herdPopulations?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.ageClasses, "/api/collar/ageClasses?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.animalMortalities, "/api/collar/animalMortalities?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.animalStatuses, "/api/collar/animalStatuses?startRow=0&rowCount=500", function (result) { return result.data; });
    }

    function EditBreedingStatusModel(breedingStatuses, breedingStatusMethods, confidenceLevels) {
        var self = this;
        this.status = ko.observable({ key: ko.observable(0) });
        this.confidenceLevel = ko.observable({ key: ko.observable(0) });
        this.method = ko.observable({ key: ko.observable(0) });
        this.date = ko.observable();

        this.breedingStatuses = breedingStatuses;
        this.breedingStatusMethods = breedingStatusMethods;
        this.confidenceLevels = confidenceLevels;

        this.saveAllowed = ko.computed(function () {
            var checkKey = function (property) { return !!property().key(); }
            return checkKey(self.status) && checkKey(self.confidenceLevel) && checkKey(self.method) && !!self.date();
        });

        this.save = function () {
            self.modal.close({
                breedingStatusKey: self.status().key(),
                breedingStatusConfidenceLevelKey: self.confidenceLevel().key(),
                breedingStatusMethodKey: self.method().key(),
                breedingStatusDate: self.date()
            });
        };

        this.cancel = function () {
            self.modal.close();
        };
    }

    function editBreedingStatus(breedingStatuses, breedingStatusMethods, confidenceLevels, callback) {
        var viewModel = new EditBreedingStatusModel(breedingStatuses, breedingStatusMethods, confidenceLevels);

        wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'editBreedingStatusTemplate'
        }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        });
    }

    function EditHerdAssociationModel(herdPopulations, herdAssociationMethods, confidenceLevels) {
        var self = this;
        this.population = ko.observable({ key: ko.observable(0) });
        this.confidenceLevel = ko.observable({ key: ko.observable(0) });
        this.method = ko.observable({ key: ko.observable(0) });
        this.date = ko.observable();

        this.herdPopulations = herdPopulations;
        this.herdAssociationMethods = herdAssociationMethods;
        this.confidenceLevels = confidenceLevels;

        this.saveAllowed = ko.computed(function () {
            var checkKey = function (property) { return !!property().key(); }
            return checkKey(self.population) && checkKey(self.confidenceLevel) && checkKey(self.method) && !!self.date();
        });

        this.save = function () {
            self.modal.close({
                herdPopulationKey: self.population().key(),
                herdAssociationConfidenceLevelKey: self.confidenceLevel().key(),
                herdAssociationMethodKey: self.method().key(),
                herdAssociationDate: self.date()
            });
        }

        this.cancel = function () {
            self.modal.close();
        }
    }

    function editHerdAssociation(herdPopulations, herdAssociationMethods, confidenceLevels, callback) {
        var viewModel = new EditHerdAssociationModel(herdPopulations, herdAssociationMethods, confidenceLevels);

        wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'editHerdAssociationTemplate'
        }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        });
    }

    function EditHistoryCommentModel(selectedHistoryItem) {
        var self = this;
        this.item = selectedHistoryItem.item;
        this.value = selectedHistoryItem.value;
        this.changeDate = selectedHistoryItem.changeDate;
        this.comment = ko.observable(selectedHistoryItem.comment);

        this.save = function () {
            wmis.global.showWaitingScreen("Saving...");
            selectedHistoryItem.comment = self.comment();

            $.ajax({
                url: "/api/collar/history",
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(selectedHistoryItem)
            }).success(function () {
                self.modal.close(selectedHistoryItem);
            }).always(function () {
                wmis.global.hideWaitingScreen();
            }).fail(function (f) {
                self.modal.close();
                wmis.global.ajaxErrorHandler(f);
            });
        }

        this.cancel = function () {
            self.modal.close();
        }
    }

    function editHistoryComment(selectedHistoryItem, callback) {
        var viewModel = new EditHistoryCommentModel(selectedHistoryItem);

        wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'editHistoryCommentTemplate'
        }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        });
    }

    function SelectProjectModel() {
        var self = this;
        this.projectOptions = {
            minimumInputLength: 1,
            ajax: {
                url: "/api/project",
                placeholder: "Projects",
                dataType: "json",
                data: function (term, page) {
                    return {
                        keywords: term,
                        startRow: (page - 1) * 25,
                        rowCount: 25
                    };
                },
                results: function (result, page, query) {
                    _.forEach(result.data, function (record) {
                        record.id = record.key;
                        var text = record.name;
                        if (record.leadRegion != null)
                            text += ' - ' + record.leadRegion.name;
                        if (record.projectLead != null)
                            text += ' - ' + record.projectLead.name;
                        record.text = text;
                    });
                    return {
                        results: result.data
                    };
                }
            }
        }

        this.save = function() {
            var selectedProject = $("#selectedProject").select2("data");
            if (selectedProject) {
                self.modal.close({
                    projectKey: selectedProject.key
                });
            } else {
                self.modal.close();
            }
        }

        this.cancel = function () {
            self.modal.close();
        }
    }

    function selectProject(callback) {
        var viewModel = new SelectProjectModel();

        wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'assignProjectTemplate'
        }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        });
    }

    function ReviewCollarDataPointModel(point, argosPassStatuses) {
        var self = this;
        this.latitude = 'Latitude:' + point.latitude;
        this.longitude = 'Longitude:' + point.longitude;
        this.date = 'Date:' + point.locationDate;
        this.acquiredTime = 'Acquired Time: ' + point.locationDate;
        this.argosPassStatus = ko.observable({
            key: ko.observable(point.argosPassStatus.key),
            name: ko.observable(point.argosPassStatus.name)
        });

        this.argosPassStatuses = argosPassStatuses;
        this.saveAllowed = ko.observable(true);
        this.save = function () {
            self.modal.close({
                argosPassId: point.key,
                argosPassStatusId: self.argosPassStatus().key()
            });
        }
        this.clearStatus = function () {
            self.modal.close({
                argosPassId: point.key,
                argosPassStatusId: 0
            });
        }
        this.cancel = function () {
            self.modal.close();
        }
    };

    function reviewCollarDataPoint(collarDataPoint, argosPassStatuses, callback, alwaysCallback) {
        var viewModel = new ReviewCollarDataPointModel(collarDataPoint, argosPassStatuses);

        wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'collarDataPointTemplate'
        }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        })
        .always(function() {
            alwaysCallback && alwaysCallback();
        });
    }

    return {
        editBreedingStatus: editBreedingStatus,
        editHerdAssociation: editHerdAssociation,
        editHistoryComment: editHistoryComment,
        selectProject: selectProject,
        reviewCollarDataPoint: reviewCollarDataPoint
    };
}(jQuery));