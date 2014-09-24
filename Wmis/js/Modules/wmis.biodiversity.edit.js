﻿$(function () {
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
		
		ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));