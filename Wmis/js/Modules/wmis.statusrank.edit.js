wmis.statusrank = wmis.statusrank || {};
wmis.statusrank.edit = (function ($) {
	var options = {
		key: null,
	};

	function editViewModel(key) {
		var self = this;
		this.key = ko.observable(key);
		this.name = ko.observable("");
		this.canSave = ko.computed(function() {
			return ($.trim(self.name()) != "");
		});

		this.get = function () {
			var url = "/api/statusrank/" + "?key=" + self.key();
			$.getJSON(url, {}, function (json) {
				if (json.data.length > 0) {
					var d = json.data[0];
					self.name(d.name);
				}
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.save = function() {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/statusrank/",
				type: "POST",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self))
			}).success(function () {
				window.location.href = "/statusrank/";
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editViewModel(options.key);
		ko.applyBindings(viewModel);

		if (viewModel.key() > 0) {
			viewModel.get();
		}
	}
	
	return {
		initialize: initialize
	};
}(jQuery));