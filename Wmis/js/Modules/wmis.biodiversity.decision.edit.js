wmis.biodiversity = wmis.biodiversity || {};
wmis.biodiversity.decision = wmis.biodiversity.decision || {};
wmis.biodiversity.decision.edit = (function ($) {
	var options = {
		bioDiversityKey: null
	};

	function viewModel() {
		var self = this;
		this.model = ko.observable();
		this.statusRank = ko.observableArray();
		this.cosewicStatus = ko.observableArray();
		this.nwtSarcAssessment = ko.observableArray();
		this.dataLoaded = ko.observable(false);

		this.load = function (key) {
			wmis.global.showWaitingScreen("Loading...");

			wmis.global.getDropDownData(self.statusRank, "/api/statusrank?startRow=0&rowCount=500", function(json) { return json.data; });
			wmis.global.getDropDownData(self.cosewicStatus, "/api/cosewicstatus?startRow=0&rowCount=500", function (json) { return json.data; });
			wmis.global.getDropDownData(self.nwtSarcAssessment, "/api/nwtsarcassessment?startRow=0&rowCount=500", function (result) { return result.data; });

			$.getJSON("/api/BioDiversity/Decision/" + key, {}, function (json) {
			    ko.mapper.fromJS(json, "auto", self.model);
			    self.dirtyFlag = wmis.global.dirtyFlagFor(ko, self.model);
			    $(window).bind('beforeunload', function() {
			        if (self.dirtyFlag.isDirty()) {
			            return "You have unsaved changes, are you sure you want to continue without saving?";
			        }
			    });
				self.dataLoaded(true);
			}).always(function () {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.canSave = ko.computed(function () {
			return self.dataLoaded() && self.model() != null;
		}, this.model());

		this.save = function () {
			wmis.global.showWaitingScreen("Saving...");

			$.ajax({
				url: "/api/BioDiversity/Decision/",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.model()))
			}).success(function () {
			    self.dirtyFlag.reset();
				window.location.href = "/biodiversity/";
			}).always(function () {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var vm = new viewModel();
		vm.load(initOptions.bioDiversityKey);
		ko.applyBindings(vm);
	}

	return {
		initialize: initialize
	};
}(jQuery));