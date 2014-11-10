wmis.collar = wmis.collar || {};
wmis.collar.edit = (function($) {
    var options = {
        collarKey: null
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

    function AnimalViewModel(collar) {
        var self = this;
        this.assignAnimal = function () {
            //TODO
            console.log("Clicked assign animal");
        }
//        this.projectData = ko.observable(),
//            this.projectWatcher = ko.computed(function() {
//                var projectKey = collar() && collar().project().key();
//                if (projectKey) {
//                    $.getJSON("/api/project/" + projectKey, {}, self.projectData);
//                } else {
//                    self.projectData(null);
//                }
//            }),
//            this.cancelProjectSelection = function() {
//                $("#selectedProject").select2("data", null);
//                $('#assignProjectModal').modal('hide');
//            }
//
//        this.saveProjectSelection = function() {
//            var selectedProject = $("#selectedProject").select2("data");
//            if (selectedProject) {
//                collar().project().key(selectedProject.key);
//                collar().project().name(selectedProject.name);
//                $('#assignProjectModal').modal('hide');
//            }
//        }
//
//        this.unassignProject = function() {
//            collar().project().key(0);
//            collar().project().name(null);
//        }
//        this.projectOptions = {
//            minimumInputLength: 1,
//            ajax: {
//                url: "/api/project",
//                placeholder: "Projects",
//                dataType: "json",
//                data: function(term, page) {
//                    return {
//                        keywords: term,
//                        startRow: (page - 1) * 25,
//                        rowCount: 25
//                    };
//                },
//                results: function(result, page, query) {
//                    _.forEach(result.data, function(record) {
//                        record.id = record.key;
//                        var text = record.name;
//                        if (record.leadRegion != null)
//                            text += ' - ' + record.leadRegion.name;
//                        if (record.projectLead != null)
//                            text += ' - ' + record.projectLead.name;
//                        record.text = text;
//                    });
//                    return {
//                        results: result.data
//                    };
//                }
//            }
//        }
    }

    function HistoryViewModel(collarKey) {
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
                    collarKey: collarKey,
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

    function ArgosDataViewModel(collarKey, collar) {
        var self = this;
        var argosPasses = ko.observableArray();

        // Load the map the first time the tab is clicked
        var mapTabClicked = ko.observable(false);
        this.loadMap = function() {
            mapTabClicked(true);
        }
        ko.computed(function() {
            if (mapTabClicked()) wmis.collar.mapping.initializeMap(collarKey, 'map-canvas', argosPasses);
        });
        
        // Call the argos webservice to fetch new collar data
        this.getArgosCollarData = function () {
            // TODO dont do this by name, use the collarId
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
        $.getJSON("/api/argos/passes?collarId= " + collarKey + "&startRow=0&rowCount=500", function (result) {
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

        wmis.global.getDropDownData(self.collarTypes, "/api/collar/type?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.collarRegions, "/api/collar/region?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.collarStatuses, "/api/collar/status?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.collarStates, "/api/collar/state?startRow=0&rowCount=500", function (result) { return result.data; });
        wmis.global.getDropDownData(self.collarMalfunctions, "/api/collar/malfunction?startRow=0&rowCount=500", function (result) { return result.data; });
    }


    function EditCollarViewModel(collarKey) {
	    var self = this;
	    this.collar = ko.observable();
		
		this.dataLoaded = ko.observable(false);

		this.projectActions = new ProjectViewModel(this.collar);
		this.animal = new AnimalViewModel(this.collar);
		this.dropdowns = new DropdownViewModel();
		this.history = new HistoryViewModel(collarKey);
        this.argosData = new ArgosDataViewModel(collarKey, this.collar);

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
			return self.dataLoaded() && self.collar() != null && typeof(self.collar().name) == "function" && $.trim(self.collar().name()) != "";
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
		
		var viewModel = new EditCollarViewModel(initOptions.collarKey);
		viewModel.getcollar(initOptions.collarKey);
		ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));