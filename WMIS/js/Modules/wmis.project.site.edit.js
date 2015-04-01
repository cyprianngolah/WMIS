wmis.project = wmis.project || {};
wmis.project.site = wmis.project.site || {};
wmis.project.site.edit = (function ($) {
    var options = {
        key: null,
        projectKey: null
    };

    function editViewModel(key, projectKey) {
        var self = this;
        this.key = ko.observable(key);
        this.projectKey = ko.observable(projectKey);

        this.siteNumber = ko.observable("");
        this.name = ko.observable("");
        this.canSave = ko.computed(function () {
            return ($.trim(self.name()) != "");
        });

        this.get = function () {
            var url = "/api/site/" + self.key();
            $.getJSON(url, {}, function (json) {
                if (json.data.length > 0) {
                    var d = json.data[0];
                    self.name(d.name);
                    self.siteNumber(d.siteNumber);
                }
            }).fail(wmis.global.ajaxErrorHandler);
        };

        this.save = function () {
            var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
            $.ajax({
                url: "/api/site/",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(ko.toJS(self))
            }).success(function () {
                window.location.href = "/Project/Edit/" + self.projectKey() + "#sitesTab";
            }).always(function () {
                wmis.global.hideWaitingScreen(waitingScreenId);
            }).fail(wmis.global.ajaxErrorHandler);
        };
    }

    function initialize(initOptions) {
        $.extend(options, initOptions);

        var viewModel = new editViewModel(options.key, options.projectKey);
        ko.applyBindings(viewModel);

        if (viewModel.key() > 0) {
            viewModel.get();
        }
    }

    return {
        initialize: initialize
    };
}(jQuery));