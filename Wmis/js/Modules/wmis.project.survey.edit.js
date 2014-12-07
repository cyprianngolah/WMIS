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
			wmis.global.showWaitingScreen("Saving...");

			$.ajax({
				url: "/api/Project/Survey",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.survey()))
			}).success(function() {
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

		var fakeResumableData = [
			{
				id: 1,
				started: new Date(),
				filename: "some.xls",
				nextStep: {
					key: 2,
					description: "Pick Headers"
				}
			},
			{
				id: 2,
				started: new Date(),
				filename: "other.xls",
				nextStep: {
					key: 3,
					description: "Map Columns"
				}
			},
			{
				id: 3,
				started: new Date(),
				filename: "thing.xls",
				nextStep: {
					key: 4,
					description: "Confirm Data"
				}
			}
		];
		self.resumableUploads = ko.observableArray(fakeResumableData);

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

		self.showResumeUploadModal = function () {
			self.currentModal("resumeUpload");
		};

		self.hideResumeUploadModal = function () {
			self.currentModal("");
		};

		self.showHeaderPickerModal = function () {
			self.showWaitingScreen();

			var observationUploadKey = self.workingUpload().id;

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

		self.successfulUpload = function () {
			self.hideWaitingScreen();
			self.showHeaderPickerModal();
		};

		self.resumeObservationUpload = function (resumableUpload) {
			self.hideResumeUploadModal();
			self.workingUpload(resumableUpload);

			// Depending on the current state of the resumed Upload, open the appropriate Modal
			switch(resumableUpload.nextStep.key) {
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

	}
	
	function initialize(initOptions) {
		$.extend(options, initOptions);

		viewModel = new editProjectSurveyViewModel();
		viewModel.getDropDowns();
		viewModel.getProjectSurvey(initOptions.projectSurveyKey);

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
			if (event.data.indexOf("observationUpload:") == 0) {
				var message = event.data.replace("observationUpload:", "");
				if (message == "") {
					viewModel.successfulUpload();
				} else {
					viewModel.showMessage(message);
				}
			}
		}, false);
	}

	return {
		initialize: initialize
	};
}(jQuery));