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

	function selectCollaborator(currentCollaboratorIds, callback) {
	    var viewModel = new SelectCollaboratorModel(currentCollaboratorIds);

	    wmis.global.showModal({
	        viewModel: viewModel,
	        context: this,
	        template: 'addCollaboratorTemplate'
	    }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        });
	}

	function SelectCollaboratorModel(currentCollaboratorIds) {
	    var self = this;
	    this.collaboratorOptions = {
	        minimumInputLength: 1,
	        ajax: {
	            url: "/api/collaborator",
	            placeholder: "Collaborators",
	            dataType: "json",
	            data: function(term, page) {
	                return {
	                    keywords: term,
	                    startRow: (page - 1) * 25,
	                    rowCount: 25
	                };
	            },
	            results: function(result, page, query) {
	                var data = _.chain(result.data)
                        .filter(function (record) {
                            // Remove all collaborators that have already been selected
	                        return !_.contains(currentCollaboratorIds, record.key);
	                    })
                        .map(function (record) {
	                        var id = record.key;
	                        var text = record.name + (record.email == "" ? '' : ' - ' + record.email);
	                        return {
	                            id: id,
	                            text: text,
	                            data: record
	                        };
	                    }).value();
	                return {
	                    results: data
	                };
	            }
	        }
	    };

	    this.save = function () {
	        var selectedValue = $("#collaboratorInput").select2("data");
	        var selectedCollaborator = selectedValue && selectedValue.data;
	        if (selectedCollaborator) {
	            var newCollaboratorIds = currentCollaboratorIds.concat(selectedCollaborator.key);
	            updateCollaborators(newCollaboratorIds, function() {
	                self.modal.close(selectedCollaborator);
	            }, function() {
	                self.modal.close();
	            });
	        } else {
	            self.modal.close();
	        }
	    }

	    this.cancel = function () {
	        self.modal.close();
	    }
	}

	function createEditCollaborator(collaboratorData, callback) {
	    var viewModel = new CreateEditCollaboratorModel(collaboratorData);

	    wmis.global.showModal({
	        viewModel: viewModel,
	        context: this,
	        template: 'createEditCollaboratorTemplate'
	    }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        });
	}

	function CreateEditCollaboratorModel(collaboratorData) {
	    var self = this;
	    var isEdit = !!collaboratorData;
	    this.titleText = isEdit ? "Edit Collaborator" : "Create Collaborator";
	    this.confirmText = isEdit ? "Save" : "Create";

	    this.collaborator = null;
	    if (collaboratorData) {
	        this.collaborator = ko.mapper.fromJS(collaboratorData);
	    } else {
	        this.collaborator = {
	            key: ko.observable(0),
	            name: ko.observable(""),
	            organization: ko.observable(""),
	            email: ko.observable(""),
	            phoneNumber: ko.observable("")
	        }
	    }

	    this.save = function () {
	        var collaborator = ko.mapper.toJS(self.collaborator);
	        collaborator.projectId = options.projectKey;
	        $.ajax({
	            url: "/api/collaborator",
	            type: self.collaborator.key() == 0 ? "POST" : "PUT",
	            contentType: "application/json",
	            dataType: "json",
	            data: JSON.stringify(collaborator)
	        }).success(function (newCollaboratorId) {
	            collaborator.key = collaborator.key || newCollaboratorId;
	            self.modal.close(collaborator);
	        }).always(function () {
                wmis.global.hideWaitingScreen();
            }).fail(function (error) {
                wmis.global.ajaxErrorHandler(error);
                self.modal.close();
            });
	    }

	    this.cancel = function () {
	        self.modal.close();
	    }
	}

	function updateCollaborators(collaboratorIds, success, failure) {
	    wmis.global.showWaitingScreen("Saving...");
	    $.ajax({
	        url: "/api/collaborator/project",
	        type: "PUT",
	        contentType: "application/json",
	        dataType: "json",
	        data: JSON.stringify({
	            projectId: options.projectKey,
	            collaboratorIds: collaboratorIds
	        })
	    }).success(success)
        .always(function () {
	        wmis.global.hideWaitingScreen();
	    }).fail(function(error) {
	        wmis.global.ajaxErrorHandler(error);
	        failure();
	    });
	}

	function EditProjectViewModel(project, projectCollaborators) {
		var self = this;
		this.project = ko.mapper.fromJS(project);

		this.statuses = ko.observableArray();
		this.regions = ko.observableArray();
		this.projectLeads = ko.observableArray();

		this.projectCollaborators = ko.observableArray(projectCollaborators);

		this.projectCollaboratorIds = ko.computed(function () {
		    return _.pluck(self.projectCollaborators(), 'key');
		});

	    this.addCollaborator = function() {
	        selectCollaborator(self.projectCollaboratorIds(), function (newCollaborator) {
	            self.projectCollaborators.push(newCollaborator);
	        });
	    };

	    this.createCollaborator = function() {
	        createEditCollaborator(null, function (newCollaborator) {
	            self.projectCollaborators.push(newCollaborator);
	        });
	    };

	    this.editCollaborator = function (collaboratorData) {
	        createEditCollaborator(collaboratorData, function (newCollaborator) {
	            self.projectCollaborators.remove(collaboratorData);
	            self.projectCollaborators.push(newCollaborator);
	        });
	    };

	    this.removeCollaborator = function(collaborator) {
	        var newCollaboratorIds = _.without(self.projectCollaboratorIds(), collaborator.key);
	        updateCollaborators(newCollaboratorIds, function() {
	            self.projectCollaborators.remove(collaborator);
	        });
	    };

		this.canSave = ko.computed(function() {
		    return $.trim(ko.unwrap(self.project.name)) != "";
		});

		this.saveProject = function() {
			wmis.global.showWaitingScreen("Saving...");

			$.ajax({
				url: "/api/Project/",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.project))
			}).success(function() {
				// TODO is it necessary to reload the project
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
							return moment.utc(data, moment.ISO_8601).format('L');
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

    function loadDropDowns(viewModel) {
        var ddp1 = wmis.global.getDropDownData(viewModel.statuses, "/api/project/statuses/?startRow=0&rowCount=500", function (json) {
			return json.data;
		});
        var ddp2 = wmis.global.getDropDownData(viewModel.projectLeads, "/api/person/projectLeads?startRow=0&rowCount=500", function (json) {
			return _.map(json.data, function(record) {
			    return {
			        key: record.key,
			        text: record.name + ' - ' + record.jobTitle
			    };
			});
		});
        var ddp3 = wmis.global.getDropDownData(viewModel.regions, "/api/leadregion?startRow=0&rowCount=500", function (json) {
			return json.data;
		});

		options.$surveyTab.on('shown.bs.tab', function (e) {
			if (surveysTable == null) {
				initSurveyDataTable(options.projectKey);
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

    function initialize(initOptions) {
        $.extend(options, initOptions);

        var projectPromise = Q($.ajax({
            url: '/api/Project/' + initOptions.projectKey,
            dataType: 'json',
            type: "GET"
        }));

        var projectCollaboratorsPromise = Q($.ajax({
            url: '/api/Collaborator/project/' + initOptions.projectKey,
            dataType: 'json',
            type: "GET"
        }));

        wmis.global.showWaitingScreen("Loading...");
        Q.all([projectPromise, projectCollaboratorsPromise]).spread(function (project, collaborators) {
            var viewModel = new EditProjectViewModel(project, collaborators);
            loadDropDowns(viewModel);
            ko.applyBindings(viewModel);
            wmis.global.hideWaitingScreen();
        }, function (error) {
            wmis.global.hideWaitingScreen();
            wmis.global.ajaxErrorHandler(error);
        }).done();
    }

	return {
		initialize: initialize
	};
}(jQuery));