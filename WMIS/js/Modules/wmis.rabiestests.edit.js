wmis.rabiestests = wmis.rabiestests || {};
wmis.rabiestests.edit = (function ($) {
    var options = {
        rtestKey: null,
    };

    function editRabiesTestsViewModel(key) {
        var self = this;
        this.key = ko.observable(key);
        this.dateTested = ko.observable(key);
        this.dataStatus = ko.observable(key);
        this.year = ko.observable(key);
        this.submittingAgency = ko.observable(key);
        this.laboratoryIDNo = ko.observable(key);
        this.testResult = ko.observable(key);
        this.community = ko.observable(key);
        this.latitude = ko.observable(key);
        this.longitude = ko.observable(key);
        this.regionId = ko.observable(key);
        this.geographicRegion = ko.observable(key);
        this.species = ko.observable(key);
        this.animalContact = ko.observable(key);
        this.humanContact = ko.observable(key);
        this.comments = ko.observable(key);

        this.canSave = ko.computed(function () {
            return ($.trim(self.community()) != "");
        });

        this.getRabiesTests = function () {
            var url = "/api/rabiestests/?RabiesTestsKey=" + self.key();
            $.getJSON(url, {}, function (json) {
                if (json.data.length > 0) {
                    var d = json.data[0];
                    self.dateTested(d.dateTested);
                    self.dataStatus(d.dataStatus);
                    self.year(d.year);
                    self.submittingAgency(d.submittingAgency);
                    self.laboratoryIDNo(d.laboratoryIDNo);
                    self.testResult(d.testResult);
                    self.community(d.community);
                    self.latitude(d.latitude);
                    self.longitude(d.longitude);
                    self.regionId(d.regionId);
                    self.geographicRegion(d.geographicRegion);
                    self.species(d.species);
                    self.animalContact(d.animalContact);
                    self.humanContact(d.humanContact);
                    self.comments(d.comments);

                    document.title = "WMIS - Rabies Tests - " + d.title;
                }
            }).fail(wmis.global.ajaxErrorHandler);
        };

        this.saveRabiesTests = function () {
            var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
            $.ajax({
                url: "/api/rabiestests/",
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(ko.toJS(self))
            }).success(function () {
                window.location.href = "/RabiesTests/";
            }).always(function () {
                wmis.global.hideWaitingScreen(waitingScreenId);
            }).fail(wmis.global.ajaxErrorHandler);
        };
    }

    function initialize(initOptions) {
        $.extend(options, initOptions);

        var viewModel = new editRabiesTestsViewModel(options.rtestKey);
        ko.applyBindings(viewModel);
        if (viewModel.key() > 0) {
            viewModel.getRabiesTests();
        }
    }

    return {
        initialize: initialize
    };
}(jQuery));