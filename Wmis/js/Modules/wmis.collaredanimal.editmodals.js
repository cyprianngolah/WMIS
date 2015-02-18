wmis.collaredanimal = wmis.collaredanimal || {};
wmis.collaredanimal.editmodals = (function ($) {

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
                        var text = record.key + ' - ' + record.name;
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
        this.comment = ko.observable(point.comment);
        this.argosPassStatuses = argosPassStatuses;
        this.saveAllowed = ko.observable(true);
        this.save = function () {
            self.modal.close({
                argosPassId: point.key,
                argosPassStatusId: self.argosPassStatus().key(),
                comment: self.comment()
            });
        }
        this.clearStatus = function () {
            self.modal.close({
                argosPassId: point.key,
                argosPassStatusId: 0,
                comment: self.comment()
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
        selectProject: selectProject,
        reviewCollarDataPoint: reviewCollarDataPoint
    };
}(jQuery));