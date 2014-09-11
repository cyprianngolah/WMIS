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
		
		this.dataLoaded = ko.observable(false);

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
			self.getDropDownData(self.kingdom, "/api/taxonomy/kingdom");
			self.getDropDownData(self.phylum, "/api/taxonomy/phylum");
			self.getDropDownData(self.subPhylum, "/api/taxonomy/subphylum");
			self.getDropDownData(self.class, "/api/taxonomy/class");
			self.getDropDownData(self.subClass, "/api/taxonomy/subclass");
			self.getDropDownData(self.order, "/api/taxonomy/order");
			self.getDropDownData(self.subOrder, "/api/taxonomy/suborder");
			self.getDropDownData(self.infraOrder, "/api/taxonomy/infraorder");
			self.getDropDownData(self.superFamily, "/api/taxonomy/superfamily");
			self.getDropDownData(self.family, "/api/taxonomy/family");
			self.getDropDownData(self.subFamily, "/api/taxonomy/subfamily");
			self.getDropDownData(self.group, "/api/taxonomy/group");
			self.getDropDownData(self.kingdom, "/api/taxonomy/kingdom");

			self.getDropDownData(self.ecoregions, "/api/ecoregion?startRow=0&rowCount=500", function(result) {
				return result.data;
			});
			self.getDropDownData(self.ecozones, "/api/ecozone?startRow=0&rowCount=500", function (result) {
				return result.data;
			});
			self.getDropDownData(self.protectedAreas, "/api/protectedArea?startRow=0&rowCount=500", function (result) {
				return result.data;
			});
			
			self.getDropDownData(self.statusRank, "/api/statusrank?startRow=0&rowCount=500", function (result) {
			    return result.data;
			});

			self.getDropDownData(self.cosewicStatus, "/api/cosewicstatus?startRow=0&rowCount=500", function (result) {
			    return result.data;
			});
		};


		this.getDropDownData = function(observableArray, url, parsingFunction) {
			$.getJSON(url, {}, function (json) {
				if (parsingFunction) {
					observableArray(parsingFunction(json));
				} else {
					observableArray(json);
				}
			}).fail(wmis.global.ajaxErrorHandler);
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