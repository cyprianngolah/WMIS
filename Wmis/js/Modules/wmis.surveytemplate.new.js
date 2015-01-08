wmis.surveytemplate = wmis.surveytemplate || {};
wmis.surveytemplate.new = (function ($) {
	
	function SurveyTemplateViewModel() {
		var self = this;
	    this.name = ko.observable('');
		
	    this.canSave = ko.computed(function () {
			return !!self.name();
	    });

		this.saveSurveyTemplate = function() {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
		    $.ajax({
		        url: "/api/surveytemplate/",
		        type: "POST",
		        contentType: "application/json",
		        dataType: "json",
		        data: JSON.stringify({
		            surveyTemplateId: 0,
		            name: self.name()
		        })
			}).success(function (surveyTemplateId) {
			    window.location.href = "/SurveyTemplate/edit/" + surveyTemplateId;
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize() {
		var viewModel = new SurveyTemplateViewModel();
        ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));