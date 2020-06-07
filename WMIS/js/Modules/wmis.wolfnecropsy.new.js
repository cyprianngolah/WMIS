wmis.wolfnecropsy = wmis.wolfnecropsy || {};
wmis.wolfnecropsy.new = (function ($) {
    var options = {

    };

    function editwolfnecropsyViewModel() {
        var self = this;
        this.necropsyid = ko.observable("");
        this.necropsyid.subscribe(function (oldValue) {
            $.trim(self.necropsyid()) == "" ? self.saveEnabled(false) : self.saveEnabled(true);
        });

        this.saveEnabled = ko.observable(false);

        this.saveBioDiversity = function () {
            var necropsyid = $.trim(self.necropsyid());

            var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
            $.ajax({
                url: "/api/wolfnecropsy/",
                type: "POST",
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                data: '=' + encodeURIComponent(necropsyid),
            }).success(function (data) {
                window.location.href = "/wolfnecropsy/edit/" + data;
            }).always(function () {
                wmis.global.hideWaitingScreen(waitingScreenId);
            }).fail(wmis.global.ajaxErrorHandler);
        };
    }

    function initialize(initOptions) {
        $.extend(options, initOptions);

        var viewModel = new editwolfnecropsyViewModel();
        ko.applyBindings(viewModel);
    }

    return {
        initialize: initialize
    };
}(jQuery));