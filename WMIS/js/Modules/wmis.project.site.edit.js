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
        this.latitude = ko.observable("");
        this.longitude = ko.observable("");
        this.projectName = ko.observable("");
        this.dateEstablished = ko.observable("");
        this.aspect = ko.observable("");
        this.cliffHeight = ko.observable("");
        this.comments = ko.observable("");
        this.habitat = ko.observable("");
        this.initialObserver = ko.observable("");
        this.map = ko.observable("");
        this.nearestCommunity = ko.observable("");
        this.nestHeight = ko.observable("");
        this.nestType = ko.observable("");
        this.reference = ko.observable("");
        this.reliability = ko.observable("");

        this.canSave = ko.computed(function () {
            var showErrors = false;

            if ($.trim(self.name()) == "")
                showErrors = true;

            var lat = $.trim(self.latitude());
            var long = $.trim(self.longitude());

            $(".form-group").removeClass("has-error");

            if (lat == "" || long == "")
                showErrors = true;

            if ((lat != "" && !jQuery.isNumeric(lat)) || (Math.abs(lat) > 90)) {
                $("#latitude").closest(".form-group").addClass("has-error");
                showErrors = true;
            }

            if ((long != "" && !jQuery.isNumeric(long)) || (Math.abs(long) > 180)) {
                $("#longitude").closest(".form-group").addClass("has-error");
                showErrors = true;
            }


            return !showErrors;
        });

        this.get = function () {
            var url = "/api/site/" + self.key();
            $.getJSON(url, {}, function (json) {
                if (json.data.length > 0) {
                    var d = json.data[0];
                    self.name(d.name);
                    self.projectKey(d.projectKey);
                    self.siteNumber(d.siteNumber);
                    self.latitude(d.latitude);
                    self.longitude(d.longitude);
                    self.dateEstablished(d.dateEstablished);
                    self.aspect(d.aspect);
                    self.cliffHeight(d.cliffHeight);
                    self.comments(d.comments);
                    self.habitat(d.habitat);
                    self.initialObserver(d.initialObserver);
                    self.map(d.map);
                    self.nearestCommunity(d.nearestCommunity);
                    self.nestHeight(d.nestHeight);
                    self.nestType(d.nestType);
                    self.reference(d.reference);
                    self.reliability(d.reliability);

                    if (self.projectName() == "")
                    {
                        self.getProject(self.projectKey());
                    }
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

        this.navigateToProject = function () {
            window.location.href = "/Project/Edit/" + self.projectKey() + "#sitesTab";
        };

        this.getProject = function (projKey) {
            $.ajax({
                url: "/api/Project/" + projKey,
                type: "GET",
                contentType: "application/json",
                dataType: "json",
            }).success(function (data) {
                self.projectKey(data.key);
                self.projectName(data.name);
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

        if (viewModel.projectKey() > 0) {
            viewModel.getProject(options.projectKey);
        }
    }

    return {
        initialize: initialize
    };
}(jQuery));