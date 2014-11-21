wmis.collaredanimal = wmis.collaredanimal || {};
wmis.collaredanimal.new = (function ($) {
	var options = {

	};

	function editCollarViewModel() {
		var self = this;
		this.collarId = ko.observable("");
		this.collarId.subscribe(function (oldValue) {
		    $.trim(self.collarId()) == "" ? self.saveEnabled(false) : self.saveEnabled(true);
		});

		this.saveEnabled = ko.observable(false);

		this.saveCollar = function () {
		    var collarId = $.trim(self.collarId());

			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/collar/",
				type: "POST",
				contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				data: '=' + encodeURIComponent(collarId),
			}).success(function(collaredAnimalKey) {
			    window.location.href = "/CollaredAnimal/Edit/" + collaredAnimalKey;
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editCollarViewModel();
		ko.applyBindings(viewModel);
	}

	return {
		initialize: initialize
	};
}(jQuery));