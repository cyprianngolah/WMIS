$(function () {
	ko.components.register('reference-widget', {
		viewModel: function (params) {
			var self = this;
			
			self.widgetReferences = params.references;
			self.categoryName = params.categoryName || "";
			self.categoryId = params.categoryId;
			self.showDialogFunction = params.showDialogFunction;
			self.references = [];
		
			self.referencesString = ko.computed(function() {
				var string = "References";
				if (typeof(self.widgetReferences()) == 'undefined')
					return string;

				self.references = [];
				for (var i = 0; i < self.widgetReferences().length; i++) {
					var r = self.widgetReferences()[i];
					if (r.categoryKey() == self.categoryId) {
						self.references.push(r.reference());
					}
				}

				if (self.references.length > 0) {
					string += " (";
					for (var i = 0; i < self.references.length; i++) {
						if (i > 0)
							string += ", ";
						string += self.references[i].code();
					}
					string += ")";
				}
				return string;
			}, this);
			
			self.showDialog = function () {
				if(typeof(self.showDialogFunction) == 'function')
					self.showDialogFunction(params.categoryName, self.categoryId, ko.toJS(self.references));
			};
		},
		template:
			'<span style="vertical-align:middle;" data-bind="text: referencesString"></span>\
			<button data-bind="click: showDialog, clickBubble: false" style="background: url(\'/Content/images/icon-0-24x24-documents.png\'); width:24px; height:24px; border:0; vertical-align:middle;"></button>'
	});
});

$(function() {
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
            self.synonymsText = ko.computed(function () {
                return formatSynonymsText(self.synonymsArray());
            });
            self.startEditing = function () {
                self.isEditing(true);
            }
            self.stopEditing = function () {
                self.isSubmitting(true);
                saveTaxonomySynonyms(self.taxonomyId(), self.synonymsArray())
                .always(function () {
                    self.isEditing(false);
                    self.isSubmitting(false);
                });
            }
        },
        template:
            '<span data-bind="visible: !isEditing() && taxonomyId()">\
            <span class="glyphicon glyphicon-edit" data-bind="visible: taxonomyId, click: startEditing"></span> <span data-bind="text: synonymsText"></span>\
            </span>\
            <span data-bind="visible: isEditing">\
            <input class="form-control" type="hidden" data-bind="select2Tags: {tags: [], val: synonymsArray}" />\
            <button class="btn btn-primary center-block" data-bind="click: stopEditing, enabled: !isSubmitting()">Save</button>\
            </span>'
    });

    ko.components.register('species-synonym-editor', {
        viewModel: function (params) {
            var self = this;
            self.speciesId = params.speciesId();
            self.speciesSynonymTypeId = params.speciesSynonymTypeId;
            self.synonymsArray = params.synonymsArray;
            self.isEditing = ko.observable(false);
            
            self.synonymsText = ko.computed(function () {
                return formatSynonymsText(self.synonymsArray());
            });
            self.startEditing = function () {
                self.isEditing(true);
            }
            self.stopEditing = function () {
                saveSpeciesSynonyms(self.speciesId, self.speciesSynonymTypeId, self.synonymsArray())
                    .always(function () {
                        self.isEditing(false);
                    });
            }
        },
        template:
            '<span data-bind="visible: !isEditing()">\
            <span class="glyphicon glyphicon-edit" data-bind="click: startEditing"></span> <span data-bind="text: synonymsText"></span>\
            </span>\
            <span data-bind="visible: isEditing">\
            <input class="form-control" type="hidden" data-bind="select2Tags: {tags: [], val: synonymsArray}" />\
            <button class="btn btn-primary center-block" data-bind="click: stopEditing">Save</button>\
            </span>'
    });
});

wmis.biodiversity = wmis.biodiversity || {};
wmis.biodiversity.edit = (function ($) {
	var options = {
		bioDiversityKey: null
	};

    var speciesSynonymsMapping = {
        1: 'speciesSynonyms',
        2: 'subSpeciesSynonyms',
        3: 'commonNameSynonyms',
        4: 'ecoTypeSynonyms',
        5: 'populationSynonyms'
    };

	function editBioDiversityViewModel() {
		var self = this;
		this.bd = ko.observable();
		this.kingdom = ko.observableArray();
		this.phylum = ko.observableArray();
		this.subPhylum = ko.observableArray();
		this.class = ko.observableArray();
		this.subClass = ko.observableArray();
		this.order = ko.observableArray();
		this.subOrder = ko.observableArray();
		this.infraOrder = ko.observableArray();
		this.superFamily = ko.observableArray();
		this.family = ko.observableArray();
		this.subFamily = ko.observableArray();
		this.group = ko.observableArray();
		this.ecozones = ko.observableArray();
		this.selectedEcozoneKeys = ko.observableArray();
		this.ecoregions = ko.observableArray();
		this.selectedEcoregionKeys = ko.observableArray();
		this.protectedAreas = ko.observableArray();
		this.selectedProtectedAreaKeys = ko.observableArray();
		this.statusRank = ko.observableArray();
		this.cosewicStatus = ko.observableArray();
		this.nwtSarcAssessment = ko.observableArray();
		this.dataLoaded = ko.observable(false);

		this.selectedReferenceCategoryName = ko.observable();
		this.selectedReferencesCategoryId = ko.observable();
		this.selectedReferences = ko.observableArray();

	    _.each(speciesSynonymsMapping, function(synonymType) {
	        self[synonymType] = ko.observableArray();
	    });

		this.referenceOptions = {			
			minimumInputLength: 1,
			multiple: true,
			ajax: {
				url: "/api/references",
				placeholder: "References",
				dataType: "json",
				data: function(term, page) {
					return {
						searchString: term,
						startRow: (page - 1) * 25,
						rowCount: 25
					};
				},
				results: function (result, page, query) {
					for (var i = 0; i < result.data.length; i++) {
						result.data[i].id = result.data[i].key;
						var text = result.data[i].code;
						if (result.data[i].author != null)
							text += ' - ' + result.data[i].author;
						if (result.data[i].title != null)
							text += ' - ' + result.data[i].title;
						result.data[i].text = text;
					}
					return {
						results: result.data
					};
				}
			}
		};

		this.getBioDiversity = function (key) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/BioDiversity/" + key;

			$.getJSON(url, {}, function (json) {
				ko.mapper.fromJS(json, "auto", self.bd);

				self.convertToArrayOfKeys(self.bd().ecozones, self.selectedEcozoneKeys);
				self.convertToArrayOfKeys(self.bd().ecoregions, self.selectedEcoregionKeys);
				self.convertToArrayOfKeys(self.bd().protectedAreas, self.selectedProtectedAreaKeys);

				self.dataLoaded(true);
			}).always(function () {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.getSpeciesSynonyms = function (key) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/biodiversity/synonym/" + key;

		    $.getJSON(url, {}, function (json) {
		        _.each(speciesSynonymsMapping, function(synonymType, id) {
		            self[synonymType](json.synonymsDictionary[id] || []);
		        });
			}).fail(wmis.global.ajaxErrorHandler);
		};
		
		this.showReferencesDialog = function (categoryName, categoryId, references) {
			self.selectedReferenceCategoryName(categoryName);
			self.selectedReferencesCategoryId(categoryId);
			for (var i = 0; i < references.length; i++) {
				references[i].id = references[i].key;
				var text = references[i].code;
				if (references[i].author != null)
					text += ' - ' + references[i].author;
				if (references[i].title != null)
					text += ' - ' + references[i].title;		
				references[i].text = text;
			}

			$("#selectedReferences").select2("data", references);	
			$('#referenceModal').modal('show');
			$('#selectedReferences').select2('open');
		};

		this.cancelReferenceChanges = function () {
			self.selectedReferences([]);			
			$('#referenceModal').modal('hide');
		};

		this.saveReferenceChanges = function () {
			// Replace all the existing References in bd.references() with categoryId == selectedReferencesCategoryId()
			// with the ones in selectedReferences()
			var selectedReferences = $("#selectedReferences").select2("data");
			var remappedReferences = _.map(selectedReferences, function (ref) { return { categoryKey: self.selectedReferencesCategoryId(), reference: ref }; });
			ko.mapper.fromJS(remappedReferences, "auto", self.selectedReferences);
			
			//self.selectedReferences(remappedReferences);

			var originalArray = _.filter(self.bd().references(), function(item) { return item.categoryKey() != self.selectedReferencesCategoryId(); });
			var newArray = _.union(originalArray, self.selectedReferences());

			self.bd().references(newArray);

			$('#referenceModal').modal('hide');
		};

		this.convertToArrayOfKeys = function(source, destination) {
			var destinationKeys = ko.utils.arrayMap(source(), function(item) {
				return item.key();
			});
			destination(destinationKeys);
		};
		
		this.getObjectsFromKeys = function(objects, keys, destination) {
			var selectedObjects = [];
			for (var i = 0; i < keys().length; i++) {
				var k = keys()[i];
				for (var j = 0; j < objects().length; j++) {
					var o = objects()[j];
					if (k == o.key) {
						selectedObjects.push(o);
						break;
					}
				}
			}
			destination(selectedObjects);
		};

		this.getDropDowns = function () {
			wmis.global.getDropDownData(self.kingdom, "/api/taxonomy/kingdom");
			wmis.global.getDropDownData(self.phylum, "/api/taxonomy/phylum");
			wmis.global.getDropDownData(self.subPhylum, "/api/taxonomy/subphylum");
			wmis.global.getDropDownData(self.class, "/api/taxonomy/class");
			wmis.global.getDropDownData(self.subClass, "/api/taxonomy/subclass");
			wmis.global.getDropDownData(self.order, "/api/taxonomy/order");
			wmis.global.getDropDownData(self.subOrder, "/api/taxonomy/suborder");
			wmis.global.getDropDownData(self.infraOrder, "/api/taxonomy/infraorder");
			wmis.global.getDropDownData(self.superFamily, "/api/taxonomy/superfamily");
			wmis.global.getDropDownData(self.family, "/api/taxonomy/family");
			wmis.global.getDropDownData(self.subFamily, "/api/taxonomy/subfamily");
			wmis.global.getDropDownData(self.group, "/api/taxonomy/group");
			wmis.global.getDropDownData(self.kingdom, "/api/taxonomy/kingdom");
			wmis.global.getDropDownData(self.ecoregions, "/api/ecoregion?startRow=0&rowCount=500", function (result) { return result.data; });
			wmis.global.getDropDownData(self.ecozones, "/api/ecozone?startRow=0&rowCount=500", function (result) { return result.data; });
			wmis.global.getDropDownData(self.protectedAreas, "/api/protectedArea?startRow=0&rowCount=500", function (result) { return result.data; });
			wmis.global.getDropDownData(self.statusRank, "/api/statusrank?startRow=0&rowCount=500", function (result) { return result.data; });
			wmis.global.getDropDownData(self.nwtSarcAssessment, "/api/nwtsarcassessment?startRow=0&rowCount=500", function (result) { return result.data; });
		};

		this.canSave = ko.computed(function() {
			return self.dataLoaded() && self.bd() != null && typeof(self.bd().name) == "function" && $.trim(self.bd().name()) != "";
		}, this.bd());

		this.saveBioDiversity = function() {
			wmis.global.showWaitingScreen("Saving...");

			self.getObjectsFromKeys(self.ecozones, self.selectedEcozoneKeys, self.bd().ecozones);
			self.getObjectsFromKeys(self.ecoregions, self.selectedEcoregionKeys, self.bd().ecoregions);
			self.getObjectsFromKeys(self.protectedAreas, self.selectedProtectedAreaKeys, self.bd().protectedAreas);
			
			$.ajax({
				url: "/api/BioDiversity/",
				type: "PUT",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.bd()))
			}).success(function() {
				//window.location.href = "/biodiversity/";
			}).always(function() {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);
		
		var viewModel = new editBioDiversityViewModel();
		viewModel.getDropDowns();
		viewModel.getBioDiversity(initOptions.bioDiversityKey);
		viewModel.getSpeciesSynonyms(initOptions.bioDiversityKey);

		ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));