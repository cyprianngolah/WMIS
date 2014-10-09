wmis.project = wmis.project || {};
wmis.project.survey = wmis.project.survey || {};
wmis.project.survey.new = (function ($) {
	var observationsTable;
	var options = {
		projectKey: null,
	};

	function newProjectSurveyViewModel() {
		var self = this;
		this.survey = ko.observable();

		this.dataLoaded = ko.observable(false);

		this.species = ko.observableArray();
		this.surveyTypes = ko.observableArray();
		this.templates = ko.observableArray();

		this.getProjectSurvey = function(projectKey) {
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

		this.getDropDowns = function() {
			//wmis.global.getDropDownData(self.statuses, "/api/project/statuses/");
			//wmis.global.getDropDownData(self.projectLeads, "/api/person/projectLeads/");
			//wmis.global.getDropDownData(self.regions, "/api/ecoregion?startRow=0&rowCount=500");
		};

		this.canSave = ko.computed(function() {
			return self.dataLoaded() && self.survey() != null;
		}, this.survey());

		this.saveProject = function() {
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