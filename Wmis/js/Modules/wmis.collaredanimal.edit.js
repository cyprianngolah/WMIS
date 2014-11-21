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

        // Click handlers
        this.cancelProjectSelection = function() {
            $("#selectedProject").select2("data", null);
            $('#assignProjectModal').modal('hide');
        };

        this.saveProjectSelection = function() {
            var selectedProject = $("#selectedProject").select2("data");
            if (selectedProject) {
                collar().project().key(selectedProject.key);
                collar().project().name(selectedProject.name);
                $('#assignProjectModal').modal('hide');
            }
        };
        this.assignProject = function() {
            $('#assignProjectModal').modal('show');
        };

        this.unassignProject = function() {
            collar().project().key(0);
            collar().project().name(null);
        };

        // Project options for assignment
        this.projectOptions = {
            minimumInputLength: 1,
            ajax: {
                url: "/api/project",
                placeholder: "Projects",
                dataType: "json",
                data: function(term, page) {
                    return {
                        keywords: term,
                        startRow: (page - 1) * 25,
                        rowCount: 25
                    };
                },
                results: function(result, page, query) {
                    _.forEach(result.data, function(record) {
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
    }

    function HistoryViewModel(collaredAnimalKey) {
        var self = this;
        this.selectedCollarHistory = ko.observable();

        this.cancelHistoryEdit = function () {
            $('#editHistoryCommentModal').modal('hide');
        }

        this.saveHistoryEdit = function() {
            wmis.global.showWaitingScreen("Saving...");

            $.ajax({
                url: "/api/collar/history",
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(ko.toJS(self.selectedCollarHistory()))
            }).success(function() {
                $("#collarHistory").DataTable().ajax.reload();
                $('#editHistoryCommentModal').modal('hide');
            }).always(function() {
                wmis.global.hideWaitingScreen();
            }).fail(wmis.global.ajaxErrorHandler);
        }

        $("#collarHistory").DataTable({
            "iDisplayLength": 25,
            "ordering": false,
            "bJQueryUI": true,
            "bProcessing": true,
            "pagingType": "bootstrap",
            "serverSide": true,
            "dom": '<"top">rt<"bottom"ip><"clear">',
            "columns": [
                {
                    "data": "changeDate",
                    "render": function(data, type, row) {
                        var date = moment.utc(data, moment.ISO_8601).local().format('L h:mm a');
                        return date;
                    }
                },
                { "data": "actionTaken" },
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
            searching: false,
            "ajax": function(data, callback, settings) {
                var parameters = {
                    // Data Tables parameter transforms
                    startRow: data.start,
                    rowCount: data.length,
                    collaredAnimalKey: collaredAnimalKey,
                };
                $.getJSON("/api/collar/history", parameters, function(json) {
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

        $("#collarHistory").on('click', 'td.editHistory span', function (event) {
            var rowIndex = $(event.target).data().rowIndex;
            var rowData = $("#collarHistory").DataTable().row(rowIndex).data();
            ko.mapper.fromJS(rowData, {}, self.selectedCollarHistory);
            $('#editHistoryCommentModal').modal('show');
            console.log(event);
        });
    }

    function ArgosDataViewModel(collaredAnimalKey, collar) {
        var self = this;
        var argosPasses = ko.observableArray();

        // Load the map the first time the tab is clicked
        var mapTabClicked = ko.observable(false);
        this.loadMap = function() {
            mapTabClicked(true);
        }
        ko.computed(function() {
            if (mapTabClicked()) wmis.collaredanimal.mapping.initializeMap(collaredAnimalKey, 'map-canvas', argosPasses);
        });
        
        // Call the argos webservice to fetch new collar data
        this.getArgosCollarData = function () {
            // TODO dont do this by name, use the collaredAnimalId
            wmis.global.showWaitingScreen("Pulling Argos Data...");
            $.ajax({
                url: "/api/argos/run/" + collar().name(),
                type: "POST",
            }).success(function () {
                console.log("sucess!");
            }).always(function () {
                wmis.global.hideWaitingScreen();
            }).fail(wmis.global.ajaxErrorHandler);
        };

        // Populate the initial passes
        $.getJSON("/api/argos/passes?collaredAnimalId= " + collaredAnimalKey + "&startRow=0&rowCount=500", function (result) {
            argosPasses(result.data);
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

    function EditBreedingStatusModel(collar) {
        var self = this;
        this.element = $('#editBreedingStatusModal');
        this.status = ko.observable({ key: ko.observable(0) });
        this.confidenceLevel = ko.observable({ key: ko.observable(0) });
        this.method = ko.observable({ key: ko.observable(0) });
        this.date = ko.observable();

        this.cancel = function() {
            self.element.modal('hide');
        };

        this.saveAllowed = ko.computed(function() {
            var checkKey = function(property) { return !!property().key(); }
            return checkKey(self.status) && checkKey(self.confidenceLevel) && checkKey(self.method) && !!self.date();
        });

        this.save = function() {
            collar().breedingStatus().key(self.status().key());
            collar().breedingStatusConfidenceLevel().key(self.confidenceLevel().key());
            collar().breedingStatusMethod().key(self.method().key());
            collar().breedingStatusDate(self.date());
                
            self.element.modal('hide');
        };
    }

    function EditHerdAssociationModel(collar) {
        var self = this;
        this.element = $('#editHerdAssociationModal');
        this.population = ko.observable({ key: ko.observable(0) });
        this.confidenceLevel = ko.observable({ key: ko.observable(0) });
        this.method = ko.observable({ key: ko.observable(0) });
        this.date = ko.observable();

        this.cancel = function() {
            self.element.modal('hide');
        };

        this.saveAllowed = ko.computed(function() {
            var checkKey = function(property) { return !!property().key(); }
            return checkKey(self.population) && checkKey(self.confidenceLevel) && checkKey(self.method) && !!self.date();
        });

        this.save = function() {
            collar().herdPopulation().key(self.population().key());
            collar().herdAssociationConfidenceLevel().key(self.confidenceLevel().key());
            collar().herdAssociationMethod().key(self.method().key());
            collar().herdAssociationDate(self.date());
            self.element.modal('hide');
        };
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
                        text: record.name
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
                         text: data.name
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

		this.editHerdAssociationData = ko.observable();
		this.editHerdAssociation = function () {
		    self.editHerdAssociationData(new EditHerdAssociationModel(self.collar));
		    $('#editHerdAssociationModal').modal('show');
		};

		this.editBreedingStatusData = ko.observable();
		this.editBreedingStatus = function () {
		    self.editBreedingStatusData(new EditBreedingStatusModel(self.collar));
		    $('#editBreedingStatusModal').modal('show');
		}
		
		this.projectActions = new ProjectViewModel(this.collar);
		this.dropdowns = new DropdownViewModel();
		this.history = new HistoryViewModel(collaredAnimalKey);
        this.argosData = new ArgosDataViewModel(collaredAnimalKey, this.collar);

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