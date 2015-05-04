wmis.help = wmis.help || {};
wmis.help.new = (function ($) {
	
	function HelpViewModel() {
		var self = this;
		this.name = ko.observable('');
		this.targetUrl = ko.observable('');
		this.ordinal = ko.observable('');
		
		this.canSave = ko.computed(function () {
		    var nameOK = $.trim(self.name()).length > 0;
		    var targetOK = $.trim(self.targetUrl()).length > 0;
		    var ordinalOK = $.trim(self.ordinal()).length > 0 && $.isNumeric(self.ordinal());

		    return nameOK && targetOK && ordinalOK;
	    });

		this.save = function() {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
		    $.ajax({
		        url: "/api/help/",
		        type: "POST",
		        contentType: "application/json",
		        dataType: "json",
		        data: JSON.stringify({
		            name: self.name(),
		            targetUrl: self.targetUrl(),
                    ordinal: self.ordinal()
		        })
			}).success(function (surveyTemplateId) {
			    window.location.href = "/Help";
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize() {
		var viewModel = new HelpViewModel();
        ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));