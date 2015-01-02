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

	function editProjectSurveyViewModel() {
		var self = this;

		self.currentModal = ko.observable("");

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Survey Functionality
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		self.survey = ko.observable();
		self.dataLoaded = ko.observable(false);

		self.species = ko.observableArray();
		self.surveyTypes = ko.observableArray();
		self.templates = ko.observableArray();

		self.getProjectSurvey = function (key) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/Project/Survey/" + key;

			$.getJSON(url, {}, function(json) {
				ko.mapper.fromJS(json, "auto", self.survey);

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
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Observation Functionality
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		self.observations = ko.observableArray();
		self.canUploadObservations = ko.observable("true");
		self.workingUpload = ko.observable(null);
		self.workingData = ko.observable();
		self.resumableUploads = ko.observableArray();
		self.headerRowIndex = ko.observableArray();
		self.firstDataRowIndex = ko.observableArray();

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


		self.getResumableSurveys = function() {
			self.showWaitingScreen();
			return $.ajax({
				url: "/api/observation/project/" + options.projectSurveyKey,
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).always(function () {
				self.hideWaitingScreen();
			}).success(function (data) {
				ko.mapper.fromJS(data, "auto", self.resumableUploads);
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.showResumeUploadModal = function () {
			self.getResumableSurveys().success(function() {
				self.currentModal("resumeUpload");
			});
		};

		self.hideResumeUploadModal = function () {
			self.currentModal("");
		};

		self.showHeaderPickerModal = function () {
			self.showWaitingScreen();

			self.headerRowIndex(self.workingUpload().headerRowIndex());
			self.firstDataRowIndex(self.workingUpload().firstDataRowIndex());

			var observationUploadKey = self.workingUpload().key();
			alert(observationUploadKey);
			return $.ajax({
				url: "/api/observation/" + observationUploadKey + "/rows",
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

		self.saveHeaderPickerRows = function() {
			self.workingUpload().headerRowIndex(self.headerRowIndex());
			self.workingUpload().firstDataRowIndex(self.firstDataRowIndex());
			self.workingUpload().status().key(2);

			$.when(self.saveWorkingUpload()).then(function() {
				self.showColumnMapperModal();
			});
		};

		self.showColumnMapperModal = function() {
			self.currentModal("columnPicker");
		};

		self.hideColumnMapperModal = function () {
			self.currentModal("");
		};

		self.showDataPreviewModal = function() {
			self.currentModal("dataPreview");
		};

		self.hideDataPreviewModal = function() {
			self.currentModal("");
		};

		// Logic
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
				self.resumableUploads.push(self.workingUpload);
				self.showHeaderPickerModal();
			}).fail(wmis.global.ajaxErrorHandler);			
		};

		self.resumeObservationUpload = function (resumableUpload) {
			self.hideResumeUploadModal();
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
			}
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
	}
	
	function initialize(initOptions) {
		$.extend(options, initOptions);

		viewModel = new editProjectSurveyViewModel();
		viewModel.getDropDowns();
		viewModel.getProjectSurvey(initOptions.projectSurveyKey);
		viewModel.getResumableSurveys();

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