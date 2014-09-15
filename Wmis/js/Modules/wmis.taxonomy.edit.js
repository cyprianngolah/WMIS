wmis.taxonomy = wmis.taxonomy || {};
wmis.taxonomy.edit = (function ($) {
	var options = {
		taxonomyKey: null,
	};

	function editTaxonomyViewModel(key) {
		var self = this;
		this.taxonomyKey = ko.observable(key);
		this.taxonomyGroupKey = ko.observable(-1);
		this.taxonomyGroups = ko.observableArray("");
		this.name = ko.observable("");
		this.canSave = ko.computed(function() {
			return ($.trim(self.name()) != "" && self.taxonomyGroupKey() > 0);
		});

		this.getTaxonomyGroups = function() {
			$.getJSON("/api/Taxonomy/TaxonomyGroup", {}, function (json) {
				self.taxonomyGroups(json);
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.getTaxonomy = function() {
			var url = "/api/Taxonomy/" + "?TaxonomyKey=" + self.taxonomyKey();
			$.getJSON(url, {}, function (json) {
				if (json.data.length > 0) {
					var d = json.data[0];
					self.taxonomyGroupKey(d.taxonomyGroup.key);
					self.name(d.name);
				}
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.saveTaxonomy = function() {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/taxonomy/",
				type: "POST",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self))
			}).success(function () {
				window.location.href = "/taxonomy/";
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editTaxonomyViewModel(options.taxonomyKey);
		ko.applyBindings(viewModel);

		viewModel.getTaxonomyGroups();
		if (viewModel.taxonomyKey() > 0) {
			viewModel.getTaxonomy();
		}
	}
	
	return {
		initialize: initialize
	};
}(jQuery));