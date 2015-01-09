wmis.project = wmis.project || {};
wmis.project.survey = wmis.project.survey || {};
wmis.project.survey.edit = (function ($) {
	var viewModel;
	var options = {
		projectSurveyKey: null,
		uploadObservationForm: null,
		observationModal: null,
		resumeObservationModal : null
	};

	function editProjectSurveyViewModel(projectSurveyKey) {
		var self = this;

		self.projectSurveyKey = projectSurveyKey;
		self.currentModal = ko.observable("");

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Survey Functionality
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		self.survey = ko.observable();
		self.dataLoaded = ko.observable(false);

		self.species = ko.observableArray();
		self.surveyTypes = ko.observableArray();
		self.templates = ko.observableArray();

		self.getProjectSurvey = function () {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/Project/Survey/" + self.projectSurveyKey;

			$.getJSON(url, {}, function(json) {
				ko.mapper.fromJS(json, "auto", self.survey);

				if (typeof(self.survey()) != 'undefined' && self.survey().template().key() > 0) {
					self.showObservationTab(true);
				}

				self.dataLoaded(true);
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.getDropDowns = function () {
			wmis.global.getDropDownData(self.species, "/api/biodiversity?startRow=0&rowCount=500", function (result) { return result.data; });
			wmis.global.getDropDownData(self.surveyTypes, "/api/project/surveytype?startRow=0&rowCount=500", function (result) { return result.data; });
			wmis.global.getDropDownData(self.templates, "/api/surveytemplate?startRow=0&rowCount=500", function (result) { return result.data; });
		};

		self.canSave = ko.computed(function () {
			return self.dataLoaded() && self.survey() != null;
		}, this.survey());

		self.saveProject = function () {
			self.hideUploadModal();
			wmis.global.showWaitingScreen("Saving...");

			$.ajax({
				url: "/api/Project/Survey",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.survey()))
			}).success(function (data) {
				self.getProjectSurvey();
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Observation Functionality
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		self.showObservationTab = ko.observable(false);
		self.showObservationTab.subscribe(function() {
			if (self.showObservationTab()) {
				self.getObservationUploads();
				self.getObservations();
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
		self.getObservations = function() {
			$.ajax({
				url: "/api/observation/survey/" + self.projectSurveyKey + "/data",
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
	}
	
	function initialize(initOptions) {
		$.extend(options, initOptions);

		viewModel = new editProjectSurveyViewModel(initOptions.projectSurveyKey);
		viewModel.getDropDowns();
		viewModel.getProjectSurvey();

		ko.applyBindings(viewModel);

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

	return {
		initialize: initialize
	};
}(jQuery));