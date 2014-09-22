wmis.project = wmis.project || {};
wmis.project.new = (function ($) {
	var options = {

	};

	function editProjectViewModel() {
		var self = this;
		this.name = ko.observable("");
		this.name.subscribe(function (oldValue) {
			$.trim(self.name()) == "" ? self.saveEnabled(false) : self.saveEnabled(true);
		});

		this.saveEnabled = ko.observable(false);

		this.saveBioDiversity = function () {
			var name = $.trim(self.name());

			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/project/",
				type: "POST",
				contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				data: '=' + encodeURIComponent(name),
			}).success(function (data) {
				window.location.href = "/project/edit/" + data;
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editProjectViewModel();
		ko.applyBindings(viewModel);
	}

	return {
		initialize: initialize
	};
}(jQuery));