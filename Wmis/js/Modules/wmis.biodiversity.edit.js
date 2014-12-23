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

wmis.biodiversity = wmis.biodiversity || {};
wmis.biodiversity.edit = (function ($) {
	var options = {
		bioDiversityKey: null
	};

    var speciesSynonymsMapping = {
        1: 'speciesSynonyms',
        2: 'subSpeciesSynonyms',
        3: 'commonNameSynonyms',
        4: 'ecoTypeSynonyms'
    };


    function SelectReferencesModel(categoryName, references) {
        var self = this;
        this.references = ko.observableArray(references);
        this.categoryName = categoryName;
        this.referenceOptions = {
            valueObservable: self.references,
            idProperty: 'key',
            textFieldNames: ['code', 'author', 'title', 'year'],
            url: '/api/references',
            placeholder: 'References'
        }

        this.save = function () {
            var resultAsObservables = ko.mapper.fromJS(self.references(), "auto");
            self.modal.close(resultAsObservables());
        }

        this.cancel = function () {
            self.modal.close();
        }
    }

    function selectReferences(categoryName, references, callback) {
        var viewModel = new SelectReferencesModel(categoryName, references);

        wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'selectReferencesTemplate'
        }).done(callback)
        .fail(function () {
            console.log("Modal cancelled");
        });
    }

	function EditBioDiversityViewModel() {
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

        // This className observable is used because binding to bd.class doesn't work properly due to it being a reserved keyword
	    this.className = ko.observable();
        
	    _.each(speciesSynonymsMapping, function(synonymType) {
	        self[synonymType] = ko.observableArray();
	    });

		this.getBioDiversity = function (key) {
			wmis.global.showWaitingScreen("Loading...");
			var url = "/api/BioDiversity/" + key;

			$.getJSON(url, {}, function (json) {
				ko.mapper.fromJS(json, "auto", self.bd);

				self.convertToArrayOfKeys(self.bd().ecozones, self.selectedEcozoneKeys);
				self.convertToArrayOfKeys(self.bd().ecoregions, self.selectedEcoregionKeys);
				self.convertToArrayOfKeys(self.bd().protectedAreas, self.selectedProtectedAreaKeys);
				if (typeof(self.bd().class) == 'undefined') {
					self.bd().class = ko.computed(function() {
						return self.className();
					});
				}
				self.className(self.bd().class());
				self.dirtyFlag = wmis.global.dirtyFlagFor(ko, self.bd);
			    $(window).bind('beforeunload', function() {
			        if (self.dirtyFlag.isDirty()) {
			            return "You have unsaved changes, are you sure you want to continue without saving?";
			        }
			    });
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
		    selectReferences(categoryName, references, function (newReferences) {
		        var originalArray = _.filter(self.bd().references(), function (item) { return item.categoryKey() != categoryId; });
		        var newReferencesWithCategory = _.map(newReferences, function(reference) {
		            return {
		                categoryKey: ko.observable(categoryId),
		                reference: ko.observable(reference)
		            };
		        });
		        var newArray = _.union(originalArray, newReferencesWithCategory);
                self.bd().references(newArray);
		    });
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

		this.getDropDowns = function() {
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
			wmis.global.getDropDownData(self.ecoregions, "/api/ecoregion?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.ecozones, "/api/ecozone?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.protectedAreas, "/api/protectedArea?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.statusRank, "/api/statusrank?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.nwtSarcAssessment, "/api/nwtsarcassessment?startRow=0&rowCount=500", function(result) { return result.data; });
			wmis.global.getDropDownData(self.cosewicStatus, "/api/cosewicstatus?startRow=0&rowCount=500", function(result) { return result.data; });
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
			}).success(function(lastUpdated) {
				//window.location.href = "/biodiversity/";
			    self.bd().lastUpdated(lastUpdated);
			    self.dirtyFlag.reset();
			}).always(function () {
				wmis.global.hideWaitingScreen();
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);
		
		var viewModel = new EditBioDiversityViewModel();
		viewModel.getDropDowns();
		viewModel.getBioDiversity(initOptions.bioDiversityKey);
		viewModel.getSpeciesSynonyms(initOptions.bioDiversityKey);

		ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));