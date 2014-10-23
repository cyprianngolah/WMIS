wmis.project = wmis.project || {};
wmis.project.survey = wmis.project.survey || {};
wmis.project.survey.edit = (function ($) {
	var observationsTable;
	var options = {
		projectSurveyKey: null,
	};

	function editProjectSurveyViewModel() {
		var self = this;
		this.survey = ko.observable();
		this.dataLoaded = ko.observable(false);

		this.species = ko.observableArray();
		this.surveyTypes = ko.observableArray();
		this.templates = ko.observableArray();

		this.getProjectSurvey = function(key) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/Project/Survey/" + key;

			$.getJSON(url, {}, function(json) {
				ko.mapper.fromJS(json, "auto", self.survey);

				self.dataLoaded(true);
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.getDropDowns = function() {
			wmis.global.getDropDownData(self.species, "/api/biodiversity?startRow=0&rowCount=500", function (result) { return result.data; });
			wmis.global.getDropDownData(self.surveyTypes, "/api/project/surveytype?startRow=0&rowCount=500", function (result) { return result.data; });
			wmis.global.getDropDownData(self.templates, "/api/surveytemplate?startRow=0&rowCount=500", function (result) { return result.data; });
		};

		this.canSave = ko.computed(function() {
			return self.dataLoaded() && self.survey() != null;
		}, this.survey());

		this.saveProject = function() {
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
	}
	
	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editProjectSurveyViewModel();
		viewModel.getDropDowns();
		viewModel.getProjectSurvey(initOptions.projectSurveyKey);

		ko.applyBindings(viewModel);	
	}

	return {
		initialize: initialize
	};
}(jQuery));