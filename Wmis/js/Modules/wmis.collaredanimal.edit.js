wmis.collaredanimal = wmis.collaredanimal || {};
wmis.collaredanimal.edit = (function($) {
    var options = {
        collaredAnimalKey: null
    };

    function ProjectViewModel(collar) {
        var self = this;
        // Reload project information any time a new project is selected for this collar
        this.projectData = ko.observable();
        this.projectWatcher = ko.computed(function() {
            var projectKey = collar() && collar().project().key();
            if (projectKey) {
                $.getJSON("/api/project/" + projectKey, {}, self.projectData);
            } else {
                self.projectData(null);
            }
        });

        this.assignProject = function () {
            wmis.collaredanimal.editmodals.selectProject(function(result) {
                collar().project().key(result.projectKey);
            });
        };

        this.unassignProject = function() {
            collar().project().key(0);
            collar().project().name(null);
        };
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
        this.programs = ko.observableArray();

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
        wmis.global.getDropDownData(self.programs, "/api/collar/programs?startRow=0&rowCount=500", function (result) { return result.data; });
    }

    var targetSpeciesOptions = {
        ajax: {
            url: "/api/biodiversity",
            placeholder: "Target Species",
            dataType: "json",
            data: function (term, page) {
                return {
                    searchString: term,
                    startRow: (page - 1) * 25,
                    rowCount: 25
                };
            },
            results: function (result, page, query) {
                var results = _.map(result.data, function(record) {
                    return {
                        id: record.key,
                        text: record.name + (record.commonName ? ' - ' + record.commonName : '')
                    };
                });
                return {
                    results: results
                };
            }
        },
        initSelection: function (element, callback) {
            // the input tag has a value attribute preloaded that points to a preselected repository's id
            // this function resolves that id attribute to an object that select2 can render
            // using its formatResult renderer - that way the repository name is shown preselected
            var id = $(element).val();
            if (id !== "") {
                $.ajax("/api/biodiversity/" + id, {
                    dataType: "json"
                }).done(function(data) {
                     callback({
                         id: data.key,
                         text: data.name + (data.commonName ? ' - ' + data.commonName : '')
                     });
                });
            }
        },
    };

    function EditCollarViewModel(collaredAnimalKey) {
        var self = this;
        this.collar = ko.observable();

        this.dataLoaded = ko.observable(false);

        this.targetSpeciesOptions = targetSpeciesOptions;

        this.editHerdAssociation = function () {
            wmis.collaredanimal.editmodals.editHerdAssociation(self.dropdowns.herdPopulations, self.dropdowns.herdAssociationMethods, self.dropdowns.confidenceLevels, function(result) {
                self.collar().herdPopulation().key(result.herdPopulationKey);
                self.collar().herdAssociationConfidenceLevel().key(result.herdAssociationConfidenceLevelKey);
                self.collar().herdAssociationMethod().key(result.herdAssociationMethodKey);
                self.collar().herdAssociationDate(result.herdAssociationDate);
            });
        };

        this.editBreedingStatus = function() {
            wmis.collaredanimal.editmodals.editBreedingStatus(self.dropdowns.breedingStatuses, self.dropdowns.breedingStatusMethods, self.dropdowns.confidenceLevels, function(result) {
                self.collar().breedingStatus().key(result.breedingStatusKey);
                self.collar().breedingStatusConfidenceLevel().key(result.breedingStatusConfidenceLevelKey);
                self.collar().breedingStatusMethod().key(result.breedingStatusMethodKey);
                self.collar().breedingStatusDate(result.breedingStatusDate);
            });
        }

        this.projectActions = new ProjectViewModel(this.collar);
        this.dropdowns = new DropdownViewModel();

        this.mapTabClicked = function() {
            wmis.collaredanimal.mapping.initializeMap(collaredAnimalKey);
        }

        this.getcollar = function (key) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/collar/" + key;
			$.getJSON(url, {}, function (json) {
				ko.mapper.fromJS(json, "auto", self.collar);
				self.dataLoaded(true);
			}).always(function () {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.canSave = ko.computed(function() {
		    return self.dataLoaded() && self.collar() != null && typeof (self.collar().collarId) == "function" && $.trim(self.collar().collarId()) != "";
		}, this.collar());

		this.saveCollar = function() {
			wmis.global.showWaitingScreen("Saving...");

			$.ajax({
				url: "/api/collar/",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.collar()))
			}).success(function() {
			    $("#collarHistory").DataTable().ajax.reload();
			}).always(function () {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);
		
		var viewModel = new EditCollarViewModel(initOptions.collaredAnimalKey);
		viewModel.getcollar(initOptions.collaredAnimalKey);
		ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));