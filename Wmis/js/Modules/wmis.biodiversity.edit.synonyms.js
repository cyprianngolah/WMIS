$(function () {
    function getSynonyms(taxonomyId) {
        return $.ajax({
            url: "/api/taxonomy/synonym",
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            async: true,
            dataType: 'json',
            data: JSON.stringify([taxonomyId])
        }).then(function (response) {
            return response[0].synonyms;
        });
    }

    function saveTaxonomySynonyms(taxonomyId, synonyms) {
        return $.ajax({
            url: "/api/taxonomy/synonym/savemany",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                taxonomyId: taxonomyId,
                synonyms: synonyms
            })
        }).fail(wmis.global.ajaxErrorHandler);
    }

    function saveSpeciesSynonyms(speciesId, speciesSynonymTypeId, synonyms) {
        var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
        return $.ajax({
            url: "/api/biodiversity/synonym/save",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                speciesId: speciesId,
                speciesSynonymTypeId: speciesSynonymTypeId,
                synonyms: synonyms
            })
        }).always(function () {
            wmis.global.hideWaitingScreen(waitingScreenId);
        }).fail(wmis.global.ajaxErrorHandler);
    }

    function formatSynonymsText(synonyms) {
        if (synonyms.length == 0) {
            return "Synonyms: None";
        } else if (synonyms.length == 1) {
            return "Synonym: " + synonyms[0];
        } else {
            return "Synonyms: " + synonyms.join(", ");
        }
    }

    ko.components.register('taxonomy-synonym-editor', {
        viewModel: function (params) {
            var self = this;
            self.taxonomyId = params.taxonomyId;
            self.isEditing = ko.observable(false);
            self.isSubmitting = ko.observable(false);
            ko.computed(function () {
                // If the selected taxonomyId changes, close eidting
                self.taxonomyId();
                self.isEditing(false);
            });
            self.synonymsArray = ko.computed(function () {
                var taxonomyId = self.taxonomyId();
                return (taxonomyId && getSynonyms(taxonomyId)) || [];
            }).extend({ async: [] });
            self.oldSynonymsArray = null;
            self.synonymsText = ko.computed(function () {
                return formatSynonymsText(self.synonymsArray());
            });
            self.startEditing = function () {
                self.oldSynonymsArray = self.synonymsArray();
                self.isEditing(true);
            };
            self.stopEditing = function () {
                self.isSubmitting(true);
                saveTaxonomySynonyms(self.taxonomyId(), self.synonymsArray())
			        .always(function () {
			            self.isEditing(false);
			            self.isSubmitting(false);
			        });
            };
            self.cancelEditing = function () {
                self.isEditing(false);
                self.synonymsArray(self.oldSynonymsArray);
            };
        },
        template:
            '<span data-bind="visible: !isEditing() && taxonomyId()">\
            <span class="glyphicon glyphicon-edit" data-bind="visible: taxonomyId, click: startEditing"></span> <span data-bind="text: synonymsText"></span>\
            </span>\
            <span data-bind="visible: isEditing">\
            <input class="form-control" type="hidden" data-bind="select2Tags: {tags: [], val: synonymsArray, placeholder: \'Enter Synonyms\'}" />\
             <div class="text-center">\
                <a class="btn btn-default" data-bind="click: cancelEditing, enabled: !isSubmitting()">Cancel</a>\
                <a class="btn btn-primary" data-bind="click: stopEditing">Save</a>\
            </div>\
            </span>'
    });

    ko.components.register('species-synonym-editor', {
        viewModel: function (params) {
            var self = this;
            self.speciesId = params.speciesId();
            self.speciesSynonymTypeId = params.speciesSynonymTypeId;
            self.synonymsArray = params.synonymsArray;
            self.isEditing = ko.observable(false);
            self.oldSynonymsArray = null;
            self.normalNameIsPopulated = ko.computed(function () {
                return params.normalName() && params.normalName().length > 0;
            });

            self.synonymsText = ko.computed(function () {
                return formatSynonymsText(self.synonymsArray());
            });
            self.startEditing = function () {
                self.isEditing(true);
                self.oldSynonymsArray = self.synonymsArray();
            };
            self.stopEditing = function () {
                saveSpeciesSynonyms(self.speciesId, self.speciesSynonymTypeId, self.synonymsArray())
			        .always(function () {
			            self.isEditing(false);
			        });
            };
            self.cancelEditing = function () {
                self.isEditing(false);
                self.synonymsArray(self.oldSynonymsArray);
            };
        },
        template:
            '<span data-bind="visible: !isEditing() && normalNameIsPopulated()">\
            <span class="glyphicon glyphicon-edit" data-bind="click: startEditing"></span> <span data-bind="text: synonymsText"></span>\
            </span>\
            <span data-bind="visible: isEditing() && normalNameIsPopulated()">\
            <input class="form-control" type="hidden" data-bind="select2Tags: {tags: [], val: synonymsArray, placeholder: \'Enter Synonyms\'}" />\
            <div class="text-center">\
                <a class="btn btn-default" data-bind="click: cancelEditing, enabled: !isSubmitting()">Cancel</a>\
                <a class="btn btn-primary" data-bind="click: stopEditing">Save</a>\
            </div>\
            </span>'
    });
});