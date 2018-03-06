wmis.biodiversity = wmis.biodiversity || {};
wmis.biodiversity.upload = (function($) {
    var options = {
        uploadSpeciesForm: null
    };

    function UploadModel() {
        var self = this;

        self.currentModal = ko.observable("");

        self.showUploadModal = function () {
            self.currentModal("upload");
        };

        self.hideUploadModal = function () {
            self.currentModal("");
        };

        self.uploadObservationFile = function () {
            options.uploadSpeciesForm.submit();
        };
    }

    function addEventHandlers(viewModel) {
        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from upload iframe
        eventer(messageEvent, function (event) {
            if (event.origin.indexOf(location.hostname) == -1) {
                alert('Origin not allowed! ' + event.origin + " != " + location.hostname);
                return;
            }
            if (event.data.indexOf("observationUploadError:") == 0) {
                var message = event.data.replace("observationUploadError:", "");
                viewModel.showMessageModal(message);
            }
            else if (event.data.indexOf("speciesUpload") == 0) {
                //var observationUploadKey = event.data.replace("observationUpload:", "");
                viewModel.hideUploadModal();
            }
        }, false);
    }

    function initialize(initOptions) {
        $.extend(options, initOptions);

        var model = new UploadModel();
        ko.applyBindings(model);
        addEventHandlers(model);
    }

    return {
        initialize: initialize
    };
}(jQuery));