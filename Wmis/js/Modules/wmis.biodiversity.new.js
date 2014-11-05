wmis.biodiversity = wmis.biodiversity || {};
wmis.biodiversity.new = (function($) {
    var options = {

    };

    function editBioDiversityViewModel() {
        var self = this;
        this.bd = new ko.observable({
            name: ko.observable(""),
            subSpeciesName: ko.observable(""),
            ecoType: ko.observable("")
        });
        this.saveEnabled = ko.computed(function () {
            var bd = self.bd();
	        var fields = [
	            bd.name,
	            bd.subSpeciesName,
	            bd.ecoType
	        ];
	        return _.every(fields, function(field) {
	            return $.trim(field()) != "";
	        });
	    });
		
		this.saveBioDiversity = function () {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/biodiversity/",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(ko.toJS(self.bd())),
			}).success(function(biodiversityKey) {
				window.location.href = "/Biodiversity/Edit/" + biodiversityKey;
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editBioDiversityViewModel();
		ko.applyBindings(viewModel);
	}

	return {
		initialize: initialize
	};
}(jQuery));