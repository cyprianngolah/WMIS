wmis.reference = wmis.reference || {};
wmis.reference.edit = (function ($) {
	var options = {
		taxonomyKey: null,
	};

	function editReferenceViewModel(key) {
		var self = this;
		this.key = ko.observable(key);
		this.code = ko.observable(key);
		this.author = ko.observable(key);
		this.year = ko.observable(key);
		this.title = ko.observable(key);
		this.editionPublicationOrganization = ko.observable(key);
		this.volumePage = ko.observable(key);
		this.publisher = ko.observable(key);
		this.city = ko.observable(key);
		this.location = ko.observable(key);	
		
		this.canSave = ko.computed(function() {
			return ($.trim(self.code()) != "");
		});

		this.getReference = function() {
			var url = "/api/References/?ReferenceKey=" + self.key();
			$.getJSON(url, {}, function (json) {
				if (json.data.length > 0) {
					var d = json.data[0];
					self.code(d.code);
					self.author(d.author);
					self.year(d.year);
					self.title(d.title);
					self.editionPublicationOrganization(d.editionPublicationOrganization);
					self.volumePage(d.volumePage);
					self.publisher(d.publisher);
					self.city(d.city);
					self.location(d.location);
				    document.title = "WMIS - Reference - " + d.title;
				}
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.saveReference = function() {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/references/",
				type: "POST",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self))
			}).success(function () {
				window.location.href = "/reference/";
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editReferenceViewModel(options.taxonomyKey);
		ko.applyBindings(viewModel);

		if (viewModel.key() > 0) {
			viewModel.getReference();
		}
	}
	
	return {
		initialize: initialize
	};
}(jQuery));