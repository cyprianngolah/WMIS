wmis.project = wmis.project || {};
wmis.project.survey = wmis.project.survey || {};
wmis.project.survey.edit = (function ($) {
	var options = {
		projectSurveyKey: null,
		uploadObservationForm: null,
		observationModal: null,
		resumeObservationModal : null
	};

	function EditProjectSurveyViewModel(projectSurvey, passStatuses) {
		var self = this;

		self.currentModal = ko.observable("");

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Survey Functionality
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		self.survey = ko.mapper.fromJS(projectSurvey);

		self.surveyTypes = ko.observableArray();
		self.templates = ko.observableArray();
		self.targetSpeciesOptions = ko.observableArray();
		self.observationData = ko.observableArray();
		self.initializedMap = ko.observable(false);
		self.projectId = self.survey.projectKey();
		self.projectHeaderDetail = "Project " + self.projectId;
		self.projectName = ko.observable();

		self.targetSpeciesOptions = targetSpeciesOptions;

		self.getDropDowns = function () {
			wmis.global.getDropDownData(self.surveyTypes, "/api/project/surveytype?startRow=0&rowCount=500&includeAllOption=false", function (result) { return result.data; });
			wmis.global.getDropDownData(self.templates, "/api/surveytemplate?startRow=0&rowCount=500", function (result) { return result.data; });
		};

		self.saveProject = function () {
			self.hideUploadModal();
			wmis.global.showWaitingScreen("Saving...");

			$.ajax({
				url: "/api/Project/Survey",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.survey))
			}).success(function (data) {
				self.showObservationTab(isTemplateAssigned());
				self.getProject();
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.navigateToProject = function () {
		    var projectUrl = "/Project/Edit/" + self.projectId + "#surveysTab";
			window.location.href = projectUrl;
		};

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Observation Functionality
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function isTemplateAssigned () {
            return self.survey.template().key() > 0;
        }
        self.showObservationTab = ko.observable();
		self.showObservationTab.subscribe(function(showObservations) {
		    if (showObservations) {
				self.getObservationUploads();
			}
		});
		self.observations = ko.observable(null);
		self.hasObservations = ko.computed(function() {
			if (self.observations() != null && self.observations().observationData().length > 0) {
			    return true;
			} 
			return false;
		});
		self.canUploadObservations = ko.observable("true");
		self.observationsTableInitialized = ko.observable(false);
		self.workingUpload = ko.observable(null);
		self.workingData = ko.observable();
		self.observationUploads = ko.observableArray();
		self.headerRowIndex = ko.observableArray();
		self.headerRowIndex.subscribe(function (newValue) {
			if (newValue != null && (newValue >= self.firstDataRowIndex() || self.firstDataRowIndex() == null)) {
				self.firstDataRowIndex(++newValue);
			}
		}.bind(this));
		self.firstDataRowIndex = ko.observableArray();
		self.rowsPicked = ko.computed(function() {
			return self.headerRowIndex() >= 0 && self.firstDataRowIndex() > 0 && self.headerRowIndex() < self.firstDataRowIndex();
		});
		self.columns = ko.observableArray();
		self.templateColumnMappings = ko.observableArray();
		self.columnsPicked = ko.computed(function() {
			for (var i = 0; i < self.templateColumnMappings().length; i++) {
				var tc = self.templateColumnMappings()[i];
				if (tc.surveyTemplateColumn().isRequired() && tc.columnIndex() == null)
					return false;
			}
			return true;
		});
		self.observationConfirmationData = ko.observableArray(null);

		// Modal Management
		self.showWaitingScreen = function () {
			wmis.global.waitingDialog.show("Working");
		};

		self.hideWaitingScreen = function() {
			wmis.global.waitingDialog.hide("Working");
		};

		self.showMessageModal = function (message) {
			alert(message);
		};

		self.hideMessageModal = function (message) {

		};

		self.showUploadModal = function() {
			self.currentModal("upload");
		};

		self.hideUploadModal = function() {
			self.currentModal("");
		};

		self.showManageUploadModal = function () {
			self.getObservationUploads().success(function () {
				
				self.currentModal("manageUpload");
			});
		};

		self.hideManageUploadModal = function () {
			self.currentModal("");
		};

		self.showHeaderPickerModal = function () {
			self.showWaitingScreen();

			self.headerRowIndex(self.workingUpload().headerRowIndex());
			self.firstDataRowIndex(self.workingUpload().firstDataRowIndex());

			var observationUploadKey = self.workingUpload().key();
			return $.ajax({
				url: "/api/observation/upload/" + observationUploadKey + "/rows",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).always(function () {
				self.hideWaitingScreen();
			}).success(function (data) {
				ko.mapper.fromJS(data, "auto", self.workingData);
				self.currentModal("headerPicker");
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.hideHeaderPickerModal = function() {
			self.currentModal("");
		};

		self.showColumnMapperModal = function () {
			self.showWaitingScreen();
			
			var observationUploadKey = self.workingUpload().key();
			var templateColumnsPromise = $.ajax({
				url: "/api/observation/upload/" + observationUploadKey + "/templateColumnMappings",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).success(function (data) {
				ko.mapper.fromJS(data, "auto", self.templateColumnMappings);
			}).fail(wmis.global.ajaxErrorHandler);
			
			var columnsPromise = $.ajax({
				url: "/api/observation/upload/" + observationUploadKey + "/columns",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).success(function (data) {
				ko.mapper.fromJS(data, "auto", self.columns);
			}).fail(wmis.global.ajaxErrorHandler);

			$.when(templateColumnsPromise, columnsPromise).then(function() {
				self.currentModal("columnPicker");
			}).always(function() {
				self.hideWaitingScreen();
			});
		};

		self.hideColumnMapperModal = function () {
			self.currentModal("");
		};

		self.showDataPreviewModal = function() {
			self.showWaitingScreen();
			var observationUploadKey = self.workingUpload().key();
			$.ajax({
				url: "/api/observation/upload/" + observationUploadKey + "/data",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).success(function (data) {
				// Dirty hack to deal with the fact that the Column Names are coming across title cased but in order to dynamically reference
				// the columnar observation data, we need a pascal cased name. Really should be an computed property, but I don't know how to make that work
				// and am running out of time. -JS
				var appendedData = data;
				for (var i = 0; i < appendedData.columns.length; i++) {
					if (appendedData.columns[i].name == null) {
						appendedData.columns[i].jsName = "";
					} else {
						appendedData.columns[i].jsName = appendedData.columns[i].name.charAt(0).toLowerCase() + appendedData.columns[i].name.slice(1);
					}
				}
				// End Dirty Hack
				ko.mapper.fromJS(data, "auto", self.observationConfirmationData);
				self.currentModal("dataPreview");
			}).always(function () {
				self.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.hideDataPreviewModal = function() {
			self.currentModal("");
		};

		// Logic
		self.getProject = function() {
			$.ajax({
				url: "/api/Project/" + self.survey.projectKey(),
				type: "GET",
				contentType: "application/json",
				dataType: "json",
			}).success(function (data) {
				self.projectName(data.name);
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.getObservations = function() {
			$.ajax({
				url: "/api/observation/survey/" + options.projectSurveyKey + "/data",
				type: "GET",
				contentType: "application/json",
				dataType: "json",
			}).success(function (data) {
				// Dirty hack to deal with the fact that the Column Names are coming across title cased but in order to dynamically reference
				// the columnar observation data, we need a pascal cased name. Really should be an computed property, but I don't know how to make that work
				// and am running out of time. -JS
				var appendedData = data;
				for (var i = 0; i < appendedData.columns.length; i++) {
					if (appendedData.columns[i].name == null) {
						appendedData.columns[i].jsName = "";
					} else {
						appendedData.columns[i].jsName = appendedData.columns[i].name.charAt(0).toLowerCase() + appendedData.columns[i].name.slice(1);
					}
				}
				// End Dirty Hack
				ko.mapper.fromJS(appendedData, "auto", self.observations);
				self.observationData(self.observations().observationData());
			    //initialize the map.*Map should be visible here or will cause error*
				if (!self.initializedMap() && self.hasObservations()) {
				    wmis.mapping.initialize(self.observationData, self.selectedPass, self.reviewObservation, function (pass) { return pass.observationRowStatusId || 0; }, false, true);
				    self.initializedMap(true);
				}

				if (!self.observationsTableInitialized()) {
					$('#locationTable').DataTable({
					    "pagingType": "bootstrap",
					    "iDisplayLength": 200,
						"scrollX": true,
						"dom": '<"top">rt<"bottom"ip><"clear">'
					});
				}
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.uploadObservationFile = function () {
			options.uploadObservationForm.submit();
		};

		self.successfulUpload = function (observationKey) {
			$.ajax({
				url: "/api/observation/upload/" + observationKey,
				type: "GET",
				contentType: "application/json",
				dataType: "json",
			}).always(function () {
				self.hideWaitingScreen();
			}).success(function (data) {
				ko.mapper.fromJS(data, "auto", self.workingUpload);
				self.observationUploads.push(self.workingUpload);
				self.showHeaderPickerModal();
			}).fail(wmis.global.ajaxErrorHandler);			
		};

		self.canResumeObservationUpload = function(resumableUpload) {
			var nextStep = resumableUpload().status().nextStep();
			return nextStep != null;
		};

		self.resumeObservationUpload = function (resumableUpload) {
			self.hideManageUploadModal();
			self.workingUpload(resumableUpload);

			// Depending on the current state of the resumed Upload, open the appropriate Modal
			var nextStepKey = resumableUpload.status().nextStep().key();
			switch (nextStepKey) {
				case 2:
					self.showHeaderPickerModal();
					break;
				case 3:
					self.showColumnMapperModal();
					break;
				case 4:
					self.showDataPreviewModal();
					break;
				case 5:
					self.showDataPreviewModal();
					break;
			}
		};
		
		self.getObservationUploads = function () {
			self.showWaitingScreen();
			return $.ajax({
				url: "/api/observation/project/" + options.projectSurveyKey,
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).always(function () {
				self.hideWaitingScreen();
			}).success(function (data) {
				ko.mapper.fromJS(data, "auto", self.observationUploads);
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.saveWorkingUpload = function() {
			return $.ajax({
				url: "/api/observation/upload/",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.workingUpload()))
			}).always(function() {
				self.hideWaitingScreen();
			}).success(function(data) {
			}).fail(wmis.global.ajaxErrorHandler);
		};
		
		self.saveHeaderPickerRows = function () {
			self.workingUpload().headerRowIndex(self.headerRowIndex());
			self.workingUpload().firstDataRowIndex(self.firstDataRowIndex());
			self.workingUpload().status().key(2);

			$.when(self.saveWorkingUpload()).then(function () {
				self.showColumnMapperModal();
			});
		};
		
		self.saveMappedColumns = function () {
			var observationUploadKey = self.workingUpload().key();
			$.ajax({
				url: "/api/observation/upload/" + observationUploadKey + "/templateColumnMappings/",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.templateColumnMappings()))
			}).always(function () {
				self.hideWaitingScreen();
			}).success(function (data) {
				self.showDataPreviewModal();
			}).fail(wmis.global.ajaxErrorHandler);
		};
		
		self.confirmData = function () {
			self.workingUpload().status().key(4);

			$.when(self.saveWorkingUpload()).then(function () {
				self.hideDataPreviewModal();
				self.getObservations();
			});
		};

	    this.selectedPass = ko.observable();

		this.reviewObservation = function(observation) {
			var selectedPass = ko.mapper.toJS(observation);
			self.selectedPass(selectedPass);

			reviewObservationDataPoint(selectedPass, passStatuses, function(result) {
				var projectSurveyPromise = $.ajax({
					url: '/api/observation/survey/row/',
					type: "PUT",
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify({
						key: selectedPass.key,
						argosPassStatusId: result.observationRowStatusId,
						comment: result.comment
					})
				}).success(function() {
					observation.observationRowStatusId(result.observationRowStatusId);
					observation.comment(result.comment);
					self.observations().observationData.valueHasMutated();

				}).always(function() {

				}).fail(wmis.global.ajaxErrorHandler);
				;
			}, function() {
				self.selectedPass(null);
			});
		};

	    this.mapTabClicked = _.once(function () {
            //initialize here so map doesn't get initialize before map is visible (causes error). 
	        self.getObservations();
	    });

	    self.showObservationTab(isTemplateAssigned());


	    self.getProject();
	}

	var targetSpeciesOptions = {
	    ajax: {
	        url: "/api/biodiversity",
	        placeholder: "Target Species",
	        dataType: "json",
	        data: function (term, page) {
	            return {
	                keywords: term,
	                startRow: (page - 1) * 25,
	                rowCount: 25
	            };
	        },
	        results: function (result, page, query) {
	            var results = _.map(result.data, function (record) {
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
	            }).done(function (data) {
	                callback({
	                    id: data.key,
	                    text: data.name + (data.commonName ? ' - ' + data.commonName : '')
	                });
	            });
	        }
	    },
	};

	function ObservationDataPointViewModel(point, argosPassStatuses) {
	    var self = this;
	    this.latitude = 'Latitude: ' + point.latitude;
	    this.longitude = 'Longitude: ' + point.longitude;
	    this.timestamp = 'Timestamp: ' + point.timestamp;
	    this.observationUploadId = 'Upload Key: ' + point.observationUploadId;
	    this.rowIndex = 'Excel Row: ' + point.rowIndex;
	    this.comment = ko.observable(point.comment);

	    var matchingStatus = _.findWhere(argosPassStatuses, { key: point.observationRowStatusId });
	    var name = matchingStatus ? matchingStatus.name : '';
	    this.argosPassStatus = ko.observable({
	        key: ko.observable(point.observationRowStatusId),
	        name: ko.observable(name)
	    });

	    this.argosPassStatuses = argosPassStatuses;
	    this.saveAllowed = ko.observable(true);
	    this.save = function () {
	        self.modal.close({
	            observationRowStatusId: self.argosPassStatus().key(),
                comment: self.comment()
	        });
	    }
	    this.clearStatus = function () {
	        self.modal.close({
	            observationRowStatusId: 0,
                comment: self.comment()
	        });
	    }
	    this.cancel = function () {
	        self.modal.close();
	    }
	};

	function reviewObservationDataPoint(observationDataPoint, passStatuses, callback, alwaysCallback) {
	    var viewModel = new ObservationDataPointViewModel(observationDataPoint, passStatuses);

	    wmis.global.showModal({
	        viewModel: viewModel,
	        context: this,
	        template: 'observationDataPointTemplate'
	    }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        })
        .always(function () {
            alwaysCallback && alwaysCallback();
        });
	}

    function createPassStatusBindingHandler(passStatuses) {
	    var passStatusesMap = _.indexBy(passStatuses, _.property('key'));
        ko.bindingHandlers.passStatus = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var passStatusId = ko.utils.unwrapObservable(valueAccessor());
                var text = passStatusId ? passStatusesMap[passStatusId].name : '';
                $(element).text(text);
            }
        };
        ko.bindingHandlers.passStatusHighlight = {
            update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                var value = ko.mapper.toJS(valueAccessor());
                var row = value.row;
                var selectedRow = value.selectedRow;
                $(element).removeClass('highlightPassRow rejected-status warning-status');
                if (selectedRow && row.key == selectedRow.key) {
                    $(element).addClass('highlightPassRow');
                } else if (!!row.observationRowStatusId) {
                    var isRejected = passStatusesMap[row.observationRowStatusId].isRejected;
                    var className = isRejected ? 'rejected-status' : 'warning-status';
                    $(element).addClass(className);
                }
            }
        };
    }

	function addEventHandlers(viewModel) {
        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from upload iframe
        eventer(messageEvent, function (event) {
            if (event.origin.indexOf(location.hostname) == -1) {
                alert('Origin not allowed! ' + event.origin + " != " + location.hostname);
                return;
            }
            if (event.data.indexOf("observationUploadError:") == 0) {
                var message = event.data.replace("observationUploadError:", "");
                viewModel.showMessageModal(message);
            }
            else if (event.data.indexOf("observationUpload:") == 0) {
                var observationUploadKey = event.data.replace("observationUpload:", "");
                viewModel.successfulUpload(observationUploadKey);
            }
        }, false);
    }

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var projectSurveyPromise = Q($.ajax({
		    url: "/api/Project/Survey/" + options.projectSurveyKey,
		    dataType: 'json',
		    type: "GET"
		}));

		var passStatusesPromise = Q($.ajax({
		    url: "/api/argos/passStatuses?startRow=0&rowCount=500",
		    dataType: 'json',
		    type: "GET"
		}));

	    Q.all([projectSurveyPromise, passStatusesPromise]).spread(function (projectSurvey, passStatusesResponse) {
	        createPassStatusBindingHandler(passStatusesResponse.data);
	        var viewModel = new EditProjectSurveyViewModel(projectSurvey, passStatusesResponse.data);
	        viewModel.getDropDowns();
	        ko.applyBindings(viewModel);

	        addEventHandlers(viewModel);
		}, wmis.global.ajaxErrorHandler).done();	
	}

	return {
		initialize: initialize
	};
}(jQuery));