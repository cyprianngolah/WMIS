wmis.collar = wmis.collar || {};
wmis.collar.new = (function ($) {
	var options = {

	};

	function editCollarViewModel() {
		var self = this;
		this.name = ko.observable("");
		this.name.subscribe(function (oldValue) {
			$.trim(self.name()) == "" ? self.saveEnabled(false) : self.saveEnabled(true);
		});

		this.saveEnabled = ko.observable(false);

		this.saveCollar = function () {
			var name = $.trim(self.name());

			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/collar/",
				type: "POST",
				contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				data: '=' + encodeURIComponent(name),
			}).success(function(collarKey) {
			    window.location.href = "/Collar/Edit/" + collarKey;
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