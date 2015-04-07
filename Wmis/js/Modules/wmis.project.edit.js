wmis.project = wmis.project || {};
wmis.project.edit = (function ($) {
    var surveysTable = null, collarsTable = null, sitesTable = null;

    var options = {
        projectKey: null,

        $newSurveyButton: $("#newSurveyButton"),
        $editSurveyButton: $("#editSurveyButton"),
        $searchSurveysButton: $("#searchSurveysButton"),
        $surveyTab: $('a[href="#surveysTab"]'),
        $surveyTable: $("#surveys"),
        $siteTab: $('#a[href="#sitesTab"]'),
        $siteTable: $("#sitesTable"),
        $collarTab: $('a[href="#collarsTab"]'),
        $collarTable: $("#collars"),
        surveyFilter: "#surveyFilter"
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
                data: function (term, page) {
                    return {
                        keywords: term,
                        startRow: (page - 1) * 25,
                        rowCount: 25
                    };
                },
                results: function (result, page, query) {
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
                updateCollaborators(newCollaboratorIds, function () {
                    self.modal.close(selectedCollaborator);
                }, function () {
                    self.modal.close();
                });
            } else {
                self.modal.close();
            }
        };

        this.cancel = function () {
            self.modal.close();
        };
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
        }).fail(function (error) {
            wmis.global.ajaxErrorHandler(error);
            failure();
        });
    }

    function EditProjectViewModel(project, projectCollaborators, userCanSeeSensitive) {
        var self = this;
        this.project = ko.mapper.fromJS(project);

        var hasCollars = (project.collarCount > 0) ? true : false;
        this.showCollarTab = ko.observable(hasCollars);
        this.userCanSeeSensitive = userCanSeeSensitive;

        this.showSurveyTab = ko.observable(!project.isSensitiveData || this.userCanSeeSensitive);

        this.statuses = ko.observableArray();
        this.regions = ko.observableArray();
        this.projectLeads = ko.observableArray();
        this.surveyTypes = ko.observableArray();
        this.surveyFilterKey = ko.observable(-1);

        this.projectCollaborators = ko.observableArray(projectCollaborators);

        this.projectCollaboratorIds = ko.computed(function () {
            return _.pluck(self.projectCollaborators(), 'key');
        });

        this.addCollaborator = function () {
            selectCollaborator(self.projectCollaboratorIds(), function (newCollaborator) {
                self.projectCollaborators.push(newCollaborator);
            });
        };

        this.createCollaborator = function () {
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

        this.removeCollaborator = function (collaborator) {
            var newCollaboratorIds = _.without(self.projectCollaboratorIds(), collaborator.key);
            updateCollaborators(newCollaboratorIds, function () {
                self.projectCollaborators.remove(collaborator);
            });
        };

        this.canSave = ko.computed(function () {
            return $.trim(ko.unwrap(self.project.name)) != "";
        });

        this.canSave = ko.computed(function () {
            return $.trim(ko.unwrap(self.project.name)) != "";
        });

        this.saveProject = function () {
            wmis.global.showWaitingScreen("Saving...");

            $.ajax({
                url: "/api/Project/",
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(ko.toJS(self.project))
            }).success(function () {

            }).always(function () {
                wmis.global.hideWaitingScreen();
            }).fail(wmis.global.ajaxErrorHandler);
        };

        this.editAdministrators = function () {
            wmis.project.editModals.editAdministrators(options.projectKey);
        };

        (function () {
            self.surveyFilterKey.subscribe(function (newPass) {
                if (newPass) {
                    surveysTable.fnFilter();
                }

            });

            self.project.isSensitiveData.subscribe(function (newVal) {
                self.showSurveyTab(!newVal || self.userCanSeeSensitive);
            });
        })();
    }

    function initSurveyDataTable(projectKey, viewmodel) {
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
				    "render": function (data, type, row) {
				        if (typeof (data) != 'undefined' && data != null) {
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
				        if (typeof (data) != 'undefined' && data != null)
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

                    //Custom search data
                    surveyTypeKey: viewmodel.surveyFilterKey()
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

    function initSiteDataTable(projectKey, viewmodel) {
        var parameters;
        sitesTable = options.$siteTable.dataTable({
            "iDisplayLength": 25,
            "scrollX": true,
            "bJQueryUI": true,
            "bProcessing": true,
            "serverSide": true,
            "ajaxSource": "/api/project/" + projectKey + "/sites/",
            "pagingType": "bootstrap",
            "dom": '<"top">rt<"bottom"ip><"clear">',
            "columns": [
				{ "data": "key" },
				{ "data": "siteNumber" },
				{ "data": "name" }
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

                    //Custom search data
                    projectKey: options.projectKey
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
                options.$siteTable.$('tr.info').removeClass('info');
                options.$editSiteButton.addClass('disabled');

                options.$siteTable.find("tbody tr").click(function () {
                    // Highlight selected row
                    if ($(this).hasClass('info')) {
                        $(this).removeClass('info');

                        options.$editSiteButton.addClass('disabled');
                    } else {
                        options.$siteTable.$('tr.info').removeClass('info');
                        $(this).addClass('info');
                        if (options.$siteTable.$('tr.info').length) {
                            // Get Data
                            var position = sitesTable.fnGetPosition(this);
                            var data = sitesTable.fnGetData(position);

                            if (data.key) {
                                options.$editSiteButton.removeClass('disabled');
                                options.$editSiteButton.prop("href", "/Project/EditSite/" + data.key);
                            }
                        }
                    }
                });
            }
        });
    }

    function initCollarDataTable(projectKey, viewmodel) {
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
				{ "data": "animalId" },
				{ "data": "animalStatus.name" },
                { "data": "herdPopulation.name" },
				{ "data": "animalSex.name" },
				{ "data": "collarStatus.name" },
				{ "data": "collarState.name" },
                {
                    "data": "key",
                    "render": function (data, type, full, meta) {
                        return '<a href="/CollaredAnimal/Edit/' + data + '">View/Edit</a>';
                    },
                    "orderable": false
                }
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
            return _.map(json.data, function (record) {
                return {
                    key: record.key,
                    text: record.name + ((record.jobTitle == null) ? "" : ' - ' + record.jobTitle)
                };
            });
        });
        var ddp3 = wmis.global.getDropDownData(viewModel.regions, "/api/leadregion?startRow=0&rowCount=500", function (json) {
            return json.data;
        });

        var ddp4 = wmis.global.getDropDownData(viewModel.surveyTypes, "/api/project/surveytype?startRow=0&rowCount=500&includeAllOption=true", function (json) {
            return json.data;
        });

        options.$surveyTab.on('shown.bs.tab', function (e) {
            if (surveysTable == null && (viewModel.userCanSeeSensitive || !viewModel.project.isSensitiveData)) {
                initSurveyDataTable(options.projectKey, viewModel);
            }
        });

        options.$siteTab.on('shown.bs.tab', function (e) {
            if (sitesTable == null) {
                initSiteDataTable(options.projectKey, viewModel);
            }
        });

        options.$collarTab.on('shown.bs.tab', function (e) {
            if (collarsTable == null) {
                initCollarDataTable(options.projectKey, viewModel);
            }
        });

        // Javascript to enable link to tab
        var url = document.location.toString();
        if (url.match('#')) {
            $('.nav-tabs a[href=#' + url.split('#')[1] + ']').tab('show');
        }

        // Change hash for page-reload
        $('.nav-tabs a').on('shown.bs.tab', function (e) {
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
            var viewModel = new EditProjectViewModel(project, collaborators, initOptions.canViewSensitive);
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