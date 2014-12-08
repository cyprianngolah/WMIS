wmis.project = wmis.project || {};
wmis.project.edit = (function ($) {
	var surveysTable = null, collarsTable = null;
	
	var options = {
		projectKey: null,
		
		$newSurveyButton: $("#newSurveyButton"),
		$editSurveyButton: $("#editSurveyButton"),
		$searchSurveysButton: $("#searchSurveysButton"),
		$surveyTab: $('a[href="#surveysTab"]'),
		$surveyTable: $("#surveys"),
		$collarTab: $('a[href="#collarsTab"]'),
		$collarTable: $("#collars"),
	};

	function editProjectViewModel() {
		var self = this;
		this.project = ko.observable();
		this.dataLoaded = ko.observable(false);

		this.statuses = ko.observableArray();
		this.regions = ko.observableArray();
		this.projectLeads = ko.observableArray();

		this.getProject = function(key) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/Project/" + key;

			return $.getJSON(url, {}, function(json) {
				ko.mapper.fromJS(json, "auto", self.project);

				self.dataLoaded(true);
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.canSave = ko.computed(function() {
			return self.dataLoaded() && self.project() != null && typeof(self.project().name) == "function" && $.trim(self.project().name()) != "";
		}, this.project());

		this.saveProject = function() {
			wmis.global.showWaitingScreen("Saving...");

			$.ajax({
				url: "/api/Project/",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.project()))
			}).success(function() {
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}
	
	function initSurveyDataTable(projectKey) {
		var parameters;
		surveysTable = options.$surveyTable.dataTable({
			"iDisplayLength": 25,
			"scrollX": true,
			"bJQueryUI": true,
			"bProcessing": true,
			"serverSide": true,
			"ajaxSource": "/api/project/" + projectKey + "/surveys/",
			"pagingType": "bootstrap",
			"dom": '<"top">rt<"bottom"ip><"clear">',
			"columns": [
				{
					"data": "surveyType",
					"render": function(data, type, row) {
						if (typeof(data) != 'undefined' && data != null) {
							return data.name;
						} else {
							return "";
						}
					}
				},
				{
					"data": "template",
					"render": function (data, type, row) {
						if (typeof (data) != 'undefined' && data != null) {
							return data.name;
						} else {
							return "";
						}
					}
				},
				{
					"data": "targetSpecies",
					"render": function (data, type, row) {
						if (typeof (data) != 'undefined' && data != null) {
							return data.name;
						} else {
							return "";
						}
					}
				},
				{
					"data": "targetSpecies",
					"render": function (data, type, row) {
						if (typeof (data) != 'undefined' && data != null) {
							return data.commonName;
						} else {
							return "";
						}
					}
				},
				{
					"data": "startDate",
					"render": function (data, type, row) {
						if (typeof(data) != 'undefined' && data != null)
							return new Date(data).toLocaleString();
						else
							return "";
					}
				},
				{ "data": "observationCount" },
			],
			"fnServerData": function (source, data, callback, settings) {
				var sortDirection = null;
				var sortedColumnName = null;
				if (settings.aaSorting.length > 0) {
					sortDirection = settings.aaSorting[0][1];
					var sortedColumnIndex = settings.aaSorting[0][0];
					sortedColumnName = settings.aoColumns[sortedColumnIndex].mData;
				}

				// Parameters that are passed during the request to the webservice
				// We're doing some transforms here because I don't want to have to write
				// DataTable specific logic into the Web Api
				parameters = {
					// Data Tables parameter transforms
					startRow: settings.oAjaxData.iDisplayStart,
					rowCount: settings.oAjaxData.iDisplayLength,
					sortBy: sortedColumnName,
					sortDirection: sortDirection,
					i: settings.oAjaxData.sEcho,
				};

				$.getJSON(source, parameters, function (json) {
					// On Success of the call, transform some of the data and call the specified callback
					// Transforms are to transform returned data into DataTable expected format so paging
					// will work properly.
					json.draw = parameters.i;
					json.recordsTotal = json.resultCount;
					json.recordsFiltered = json.resultCount;
					callback(json);
				}).fail(wmis.global.ajaxErrorHandler);
			},
			"fnDrawCallback": function () {
				options.$surveyTable.$('tr.info').removeClass('info');
				options.$editSurveyButton.addClass('disabled');

				options.$surveyTable.find("tbody tr").click(function () {
					// Highlight selected row
					if ($(this).hasClass('info')) {
						$(this).removeClass('info');

						options.$editSurveyButton.addClass('disabled');
					} else {
						options.$surveyTable.$('tr.info').removeClass('info');
						$(this).addClass('info');
						if (options.$surveyTable.$('tr.info').length) {
							// Get Data
							var position = surveysTable.fnGetPosition(this);
							var data = surveysTable.fnGetData(position);

							if (data.key) {
								options.$editSurveyButton.removeClass('disabled');
								options.$editSurveyButton.prop("href", "/Project/EditSurvey/" + data.key);
							}
						}
					}
				});
			}
		});
	}
	
	function initCollarDataTable(projectKey) {
		var parameters;
		collarsTable = options.$collarTable.dataTable({
			"iDisplayLength": 25,
			"scrollX": true,
			"bJQueryUI": true,
			"bProcessing": true,
			"serverSide": true,
			"ajaxSource": "/api/project/" + projectKey + "/collars/",
			"pagingType": "bootstrap",
			"dom": '<"top">rt<"bottom"ip><"clear">',
			"columns": [
				{ "data": "adminRegion.name" },
				{ "data": "collarStatus.name" },
				{ "data": "species" },
				{ "data": "commonName" },
				{ "data": "subSpecies" },
				{ "data": "animalStatus.name" }
			],
			"fnServerData": function (source, data, callback, settings) {
				var sortDirection = null;
				var sortedColumnName = null;
				if (settings.aaSorting.length > 0) {
					sortDirection = settings.aaSorting[0][1];
					var sortedColumnIndex = settings.aaSorting[0][0];
					sortedColumnName = settings.aoColumns[sortedColumnIndex].mData;
				}

				// Parameters that are passed during the request to the webservice
				// We're doing some transforms here because I don't want to have to write
				// DataTable specific logic into the Web Api
				parameters = {
					// Data Tables parameter transforms
					startRow: settings.oAjaxData.iDisplayStart,
					rowCount: settings.oAjaxData.iDisplayLength,
					sortBy: sortedColumnName,
					sortDirection: sortDirection,
					i: settings.oAjaxData.sEcho,
				};

				$.getJSON(source, parameters, function (json) {
					// On Success of the call, transform some of the data and call the specified callback
					// Transforms are to transform returned data into DataTable expected format so paging
					// will work properly.
					json.draw = parameters.i;
					json.recordsTotal = json.resultCount;
					json.recordsFiltered = json.resultCount;
					callback(json);
				}).fail(wmis.global.ajaxErrorHandler);
			}
		});
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var vm = new editProjectViewModel();
		var ddp1 = wmis.global.getDropDownData(vm.statuses, "/api/project/statuses/?startRow=0&rowCount=500", function (json) {
			return json.data;
		});
		var ddp2 = wmis.global.getDropDownData(vm.projectLeads, "/api/person/projectLeads?startRow=0&rowCount=500", function (json) {
			return _.map(json.data, function(record) {
			    return {
			        key: record.key,
			        text: record.name + ' - ' + record.jobTitle
			    };
			});
		});
		var ddp3 = wmis.global.getDropDownData(vm.regions, "/api/leadregion?startRow=0&rowCount=500", function (json) {
			return json.data;
		});
		vm.getProject(initOptions.projectKey);
		
		ko.applyBindings(vm);

		options.$surveyTab.on('shown.bs.tab', function (e) {
			if (surveysTable == null) {
				initSurveyDataTable(initOptions.projectKey);
			}
		});
		
		options.$collarTab.on('shown.bs.tab', function (e) {
			if (collarsTable == null) {
				//initCollarDataTable(initOptions.projectKey);
			}
		});
		
		// Javascript to enable link to tab
		var url = document.location.toString();
		if (url.match('#')) {
			$('.nav-tabs a[href=#' + url.split('#')[1] + ']').tab('show');
		}

		// Change hash for page-reload
		$('.nav-tabs a').on('shown.bs.tab', function(e) {
			window.location.hash = e.target.hash;
		});
	}

	return {
		initialize: initialize
	};
}(jQuery));