wmis.project = wmis.project || {};
wmis.project.survey = wmis.project.survey || {};
wmis.project.survey.new = (function ($) {
	var observationsTable;
	var options = {
		projectKey: null,
	};

	function newProjectSurveyViewModel() {
		var self = this;
		self.survey = ko.observable();

		self.dataLoaded = ko.observable(false);

		self.targetSpeciesOptions = ko.observableArray();
		self.surveyTypes = ko.observableArray();
		self.templates = ko.observableArray();

		self.showObservationTab = ko.observable(false);
		self.showUploadModal = ko.observable(false);
		self.canUploadObservations = ko.observable(false);
		self.showManageUploadModal = ko.observable(false);
		self.hasObservations = ko.observable(false);
		self.observationUploads = ko.observableArray();

		self.getProjectSurvey = function (projectKey) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/Project/Survey/0";

			$.getJSON(url, {}, function(json) {
				ko.mapper.fromJS(json, "auto", self.survey);
				self.survey().projectKey(projectKey);

				self.dataLoaded(true);
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.getDropDowns = function () {
		    wmis.global.getDropDownData(self.surveyTypes, "/api/project/surveytype?startRow=0&rowCount=500&includeAllOption=false", function (result) { return result.data; });
		    wmis.global.getDropDownData(self.templates, "/api/surveytemplate?startRow=0&rowCount=500", function (result) { return result.data; });
		    wmis.global.getDropDownData(self.targetSpeciesOptions, "/api/biodiversity/species?startRow=0&rowCount=500", function (result) { return result.data; });
		};

		this.mapTabClicked = function () {
		    wmis.collaredanimal.mapping.initializeMap(collaredAnimalKey);
		}

		self.canSave = ko.computed(function () {
			return self.dataLoaded() && self.survey() != null;
		}, this.survey());

		self.saveProject = function () {
			wmis.global.showWaitingScreen("Saving...");

			$.ajax({
				url: "/api/Project/Survey",
				type: "POST",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.survey()))
			}).success(function (surveyKey) {
				window.location.href = "/Project/Edit/" + options.projectKey + "/#surveysTab";
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};
		
		self.navigateToProject = function () {
			var projectUrl = "/Project/Edit/" + self.survey().projectKey() + "#surveysTab";
			window.location.href = projectUrl;
		};
	}
	
	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new newProjectSurveyViewModel();
		viewModel.getDropDowns();
		viewModel.getProjectSurvey(initOptions.projectKey);

		ko.applyBindings(viewModel);	
	}

	return {
		initialize: initialize
	};
}(jQuery));