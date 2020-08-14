wmis.rabiestests = wmis.rabiestests || {};
wmis.rabiestests.new = (function ($) {
	var options = {
	};

	function editRabiesTestsViewModel() {
		var self = this;
		this.rt = new ko.observable({
			dateTested: ko.observable(""),
			dataStatus: ko.observable(""),
			year: ko.observable(""),
			submittingAgency: ko.observable(""),
			laboratoryIDNo: ko.observable(""),
			testResult: ko.observable(""),
			community: ko.observable(""),
			lattitude: ko.observable(""),
			longitude: ko.observable(""),
			regionId: ko.observable(""),
			geographicRegion: ko.observable(""),
			species: ko.observable(""),
			animalContact: ko.observable(""),
			humanContact: ko.observable(""),
			comments: ko.observable(""),
		});
		this.saveEnabled = ko.computed(function () {
			var rt = self.rt();
			var fields = [
				rt.dateTested,
				rt.dataStatus,
				rt.year,
				rt.submittingAgency,
				rt.laboratoryIDNo,
				rt.testResult,
				rt.community,
				rt.latitude,
				rt.longitude,
				rt.regionId,
				rt.geographicRegion,
				rt.species,
				rt.animalContact,
				rt.humanContact,
				rt.comments	
			];
			return _.every(fields, function (field) {
				return $.trim(field()) != "";
			});
		});

		this.saveRabiesTests = function () {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/RabiesTests/",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(ko.toJS(self.rt())),
			}).success(function (RabiesTestsKey) {
				window.location.href = "/RabiesTests/";

			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editRabiesTestsViewModel();
		ko.applyBindings(viewModel);
	}

	return {
		initialize: initialize
	};
}(jQuery));