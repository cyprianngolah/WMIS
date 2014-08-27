wmis.taxonomy = wmis.taxonomy || {};
wmis.taxonomy.edit = (function ($) {
	var options = {
		
	};

	function editTaxonomyViewModel() {
		var self = this;
		this.key = ko.observable(-1);
		this.taxonomyGroupKey = ko.observable(-1);
		this.taxonomy = ko.observable("");
		this.taxonomyGroups = ko.observableArray("");

		this.getTaxonomyGroups = function() {
			$.getJSON("/api/Taxonomy/TaxonomyGroup", {}, function (json) {
				self.taxonomyGroups(json);
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.getTaxonomy = function() {
			var url = "/api/Taxonomy/" + "?TaxonomyKey=" + self.key();
			$.getJSON(url, {}, function (json) {
				if (json.data.length > 0) {
					var d = json.data[0];
					self.taxonomyGroupKey(d.taxonomyGroup.key);
					self.taxonomy(d.name);
				}
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.saveTaxonomy = function() {
			alert('save that shiz! ' + self.taxonomy());
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editTaxonomyViewModel();
		ko.applyBindings(viewModel);

		viewModel.key($("#taxonomyKey").val());
		viewModel.getTaxonomyGroups();
		if (viewModel.key() > 0) {
			viewModel.getTaxonomy();
		}
	}
	
	return {
		initialize: initialize
	};
}(jQuery));