wmis.collar = wmis.collar || {};
wmis.collar.edit = (function ($) {
	var options = {
		collarKey: null
	};

	function editcollarViewModel() {
		var self = this;
		this.collar = ko.observable();
		this.collarTypes = ko.observableArray();
		this.collarRegions = ko.observableArray();
		this.collarStatuses = ko.observableArray();
		this.collarMalfunctions = ko.observableArray();
		this.collarStates = ko.observableArray();
		this.dataLoaded = ko.observable(false);
		this.project = ko.observable();

	    this.selectedCollarHistory = ko.observable();

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
	    };
	    this.cancelProjectSelection = function() {
	        $("#selectedProject").select2("data", null);
	        $('#assignProjectModal').modal('hide');
	    }
	    this.saveProjectSelection = function() {
	        var selectedProject = $("#selectedProject").select2("data");
	        if (selectedProject) {
	            self.collar().project().key(selectedProject.key);
	            self.collar().project().name(selectedProject.name);
	            $('#assignProjectModal').modal('hide');
	        }
	    }
	    this.assignProject = function () {
	        $('#assignProjectModal').modal('show');
	    };

	    this.unassignProject = function () {
	        self.collar().project().key(0);
	        self.collar().project().name(null);
	    };

	    this.cancelHistoryEdit = function () {
	        $('#editHistoryCommentModal').modal('hide');
	    }

	    this.saveHistoryEdit = function () {
	        wmis.global.showWaitingScreen("Saving...");

	        $.ajax({
	            url: "/api/collar/history",
	            type: "PUT",
	            contentType: "application/json",
	            dataType: "json",
	            data: JSON.stringify(ko.toJS(self.selectedCollarHistory()))
	        }).success(function () {
	            $("#collarHistory").DataTable().ajax.reload();
	            $('#editHistoryCommentModal').modal('hide');
	        }).always(function () {
	            wmis.global.hideWaitingScreen();
	        }).fail(wmis.global.ajaxErrorHandler);
	    }

	    this.assignAnimal = function() {
	        //TODO
	        console.log("Clicked assign animal");
	    };

	    this.getcollar = function (key) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/collar/" + key;

			$.getJSON(url, {}, function (json) {
				ko.mapper.fromJS(json, "auto", self.collar);
				self.dataLoaded(true);
			    self.projectData = ko.computed(function() {
			        var projectKey = self.collar().project().key();
			        if (projectKey != 0) {
			            self.loadProject(projectKey);
			        } else {
			            self.project(null);
			        }
			    });
			}).always(function () {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.loadProject = function (projectKey) {
		    console.log("project:" + projectKey);
		    var url = "/api/project/" + projectKey;
		    $.getJSON(url, {}, self.project);
		};

		this.convertToArrayOfKeys = function(source, destination) {
			var destinationKeys = ko.utils.arrayMap(source(), function(item) {
				return item.key();
			});
			destination(destinationKeys);
		};
		
		this.getObjectsFromKeys = function(objects, keys, destination) {
			var selectedObjects = [];
			for (var i = 0; i < keys().length; i++) {
				var k = keys()[i];
				for (var j = 0; j < objects().length; j++) {
					var o = objects()[j];
					if (k == o.key) {
						selectedObjects.push(o);
						break;
					}
				}
			}
			destination(selectedObjects);
		};

		this.getDropDowns = function() {
			wmis.global.getDropDownData(self.collarTypes, "/api/collar/type?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.collarRegions, "/api/collar/region?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.collarStatuses, "/api/collar/status?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.collarStates, "/api/collar/state?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.collarMalfunctions, "/api/collar/malfunction?startRow=0&rowCount=500", function(result) { return result.data; });
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

	function initializeHistoryDataTable(collarKey, viewModel) {
	    var collarTable = $("#collarHistory").DataTable({
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
                    "render": function (data, type, row) {
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
                    "render": function (data, type, row, meta) {
	                    return '<span class="glyphicon glyphicon-edit" data-row-index="' + meta.row+ '"/>';
	                }
	            }
	        ],
            searching: false,
            "ajax": function (data, callback, settings) {
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
	        ko.mapper.fromJS(rowData, {}, viewModel.selectedCollarHistory);
	        $('#editHistoryCommentModal').modal('show');
	        console.log(event);
	    });
	}


	function initialize(initOptions) {
		$.extend(options, initOptions);
		
		var viewModel = new editcollarViewModel();
		viewModel.getDropDowns();
		viewModel.getcollar(initOptions.collarKey);

		initializeHistoryDataTable(initOptions.collarKey, viewModel);

		ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));