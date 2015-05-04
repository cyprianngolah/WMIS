wmis.help = wmis.help || {};
wmis.help.edit = (function ($) {
    var options = {
        key: null
    }

    function HelpViewModel(key) {
        var self = this;
        this.key = ko.observable(key);
        this.name = ko.observable('');
        this.targetUrl = ko.observable('');
        this.ordinal = ko.observable('');

        this.canSave = ko.computed(function () {
            var nameOK = $.trim(self.name()).length > 0;
            var targetOK = $.trim(self.targetUrl()).length > 0;
            var ordinalOK = $.trim(self.ordinal()).length > 0 && $.isNumeric(self.ordinal());

            return nameOK && targetOK && ordinalOK;
        });

        this.get = function () {
            var url = "/api/help/" + self.key();
            $.getJSON(url, {}, function (json) {
                if (json) {
                    var d = json;
                    self.name(d.name);
                    self.targetUrl(d.targetUrl);
                    self.ordinal(d.ordinal);
                }
            }).fail(wmis.global.ajaxErrorHandler);
        };

        this.save = function () {
            var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
            $.ajax({
                url: "/api/help/",
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    key: self.key(),
                    name: self.name(),
                    targetUrl: self.targetUrl(),
                    ordinal: self.ordinal()
                })
            }).success(function () {
                window.location.href = "/Help";
            }).always(function () {
                wmis.global.hideWaitingScreen(waitingScreenId);
            }).fail(wmis.global.ajaxErrorHandler);
        };

        this.doDelete = function () {
            if (confirm("Are you sure you want to delete this Help Link?")) {
                var self = this;
                var id = self.key();
                $.ajax({
                    url: "/api/help/" + id,
                    type: "DELETE",
                }).success(function () {
                    window.location.href = "/Help";
                }).fail(wmis.global.ajaxErrorHandler);
            }
        };
    }

    function initialize(initOptions) {
        $.extend(options, initOptions);

        var viewModel = new HelpViewModel(options.key);
        ko.applyBindings(viewModel);
        
		if (viewModel.key() > 0) {
			viewModel.get();
		}
    }

    return {
        initialize: initialize
    };
}(jQuery));