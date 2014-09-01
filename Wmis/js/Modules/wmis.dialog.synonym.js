wmis.dialog = wmis.dialog || {};
wmis.dialog.synonym = (function ($) {

    var options = {
        modalSelector: "",
        saveButtonSelector: "",
        synonymUrl: "",
        synonymSaveManyUrl: ""
    };

    var viewModel = {};

    function initialize(initOptions) {
        $.extend(options, initOptions);

        viewModel = { taxonomy: ko.observableArray() };
        ko.applyBindings(viewModel);

        $(options.saveButtonSelector).click(function () {
            save();
        });
    }
    
    function show(args) {
        // Clear and show the modal dialog
        reset();
        $(options.modalSelector).modal('show');

        // Populate the view model from the provided args
        var taxonomyIds = [];
        for (var i = 0; i < args.length; i++) {
            taxonomyIds.push(args[i].taxonomyId);
        }

        $.ajax({
            url: options.synonymUrl,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(taxonomyIds),
            xhrFields: { withCredentials: true }
        }).done(function(data) {
            for (i = 0; i < args.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (args[i].taxonomyId == data[j].taxonomyId) {
                        addTaxonomy(data[j].taxonomyId,
                            args[i].name,
                            args[i].groupName,
                            data[j].synonyms);
                    }
                }
            }
        });
    };

    function save() {
        $.ajax({
            url: options.synonymSaveManyUrl,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: serialize(),
            xhrFields: { withCredentials: true }
        }).done(function () {
            $(options.modalSelector).modal('hide');
        });
    };

    function reset() {
        viewModel.taxonomy.removeAll();
    };

    function addTaxonomy(id, name, groupName, synonyms) {
        viewModel.taxonomy.push({
            taxonomyId: id,
            name: name,
            groupName: groupName,
            synonyms: synonyms,
            synonymsValue: ko.observable(synonyms.join(",")),
        });
    };

    function serialize() {
        var result = [];
        var taxonomyArray = viewModel.taxonomy();
        for (var i = 0; i < taxonomyArray.length; i++) {
            result.push({
                taxonomyId: taxonomyArray[i].taxonomyId,
                synonyms: taxonomyArray[i].synonymsValue().split(",").filter(function (v) { return v !== ''; })
            });
        }
        return JSON.stringify(result);
    };

    return {
        initialize: initialize,
        show: show,
    };
}(jQuery));