wmis.biodiversity = wmis.biodiversity || {};
wmis.biodiversity.index = (function($) {
    var bioDiversityTable;
    var selectedSpecies;

	var options = {
		searchButtonSelector: "#searchButton",
		editButtonSelector: "#editButton",
		decisionButtonSelector: "#decisionButton",
		groupSelector: "#group",
		orderSelector: "#order",
		familySelector: "#family",
		keywordsSelector: "#keywords",
        biodiversitySelector: "#biodiversity",
        deleteButtonSelector: "#deleteSpeciesButton"
    };


    function BiodiversityModel() {
        var self = this;

        self.removeSpecies = function () {
            
            if (selectedSpecies) {
                var result = confirm("Sure you want to delete this species? Note that if the species is linked to any Survey data or has references, it will not be deleted! You can contact WMIS support in such cases.");
                if (result) {

                    wmis.global.showWaitingScreen("Deleting...");

                    $.ajax({
                        url: "/api/biodiversity/species/" + selectedSpecies +"/delete/",
                        type: "DELETE",
                    }).success(function () {
                        window.location.href = "/Biodiversity";
                    }).always(function () {
                        wmis.global.hideWaitingScreen();
                    }).fail(function (f) {
                        console.log(f)
                        $('#deleteErrorAlert').removeClass('hidden');
                        $('#deleteError').text(f.responseJSON.exceptionMessage);
                        //wmis.global.ajaxErrorHandler(f);
                    });
                }
            }
            
        };
    }
    

	function initialize(initOptions) {
		$.extend(options, initOptions);

		initDataTable();
		
		wmis.global.loadAndInitializeSelect2($(options.groupSelector), "/api/taxonomy/group/", "Group");
		wmis.global.loadAndInitializeSelect2($(options.orderSelector), "/api/taxonomy/order/", "Order");
		wmis.global.loadAndInitializeSelect2($(options.familySelector), "/api/taxonomy/family/", "Family");

		document.title = "WMIS Biodiversity";
		$(options.keywordsSelector).keyup(function (e) {
			if (e.keyCode == 13) {
				bioDiversityTable.fnFilter();
			}
		});

		$(options.searchButtonSelector).click(function () {
			bioDiversityTable.fnFilter();
		});

		$(options.groupSelector).change(function () {
		    $(options.orderSelector).val("");
		    $(options.orderSelector).trigger("change");

		    $(options.familySelector).val("");
		    $(options.familySelector).trigger("change");

		    bioDiversityTable.fnFilter();
		});

		$(options.orderSelector).change(function () {
		    bioDiversityTable.fnFilter();
		});

		$(options.familySelector).change(function () {
		    bioDiversityTable.fnFilter();
        });

        // add biodiversity model to bind to click events
        var model = new BiodiversityModel();
        ko.applyBindings(model);

	}
	
	function initDataTable() {
		var parameters;
		bioDiversityTable = $(options.biodiversitySelector).dataTable({
			"iDisplayLength": 25,
			"scrollX": true,
			"bJQueryUI": true,
			"bProcessing": true,
			"serverSide": true,
			"ajaxSource": "/api/biodiversity/",
			"pagingType": "bootstrap",
			"dom": '<"top">rt<"bottom"ip><"clear">',
			"columns": [
				{ "data": "group.name" },
				{ "data": "order.name" },
				{ "data": "family.name" },
				{ "data": "commonName" },
				{ "data": "name" },
				{ "data": "subSpeciesName" },
				{ "data": "statusRank.name" },
				{
				    "data": "lastUpdated",
				    "render": function (data, type, row) {
				    	if (typeof (data) != 'undefined' && data != null)
				    		return moment(data, moment.ISO_8601).format('L');
				    	else
				    		return "";
				    }
				}
			],
			"fnServerData": function (source, data, callback, settings) {
				var sortDirection = null;
				var sortedColumnName = null;
				if (settings.aaSorting.length > 0) {
					sortDirection = settings.aaSorting[0][1];
					var sortedColumnIndex = settings.aaSorting[0][0];
					sortedColumnName = settings.aoColumns[sortedColumnIndex].mData;
				}

				// Parameters that are passed during the request to the webservice
				// We're doing some transforms here because I don't want to have to write
				// DataTable specific logic into the Web Api
				parameters = {
					// Data Tables parameter transforms
					startRow: settings.oAjaxData.iDisplayStart,
					rowCount: settings.oAjaxData.iDisplayLength,
					sortBy: sortedColumnName,
					sortDirection: sortDirection,
					i: settings.oAjaxData.sEcho,

					// Custom search data
					groupKey: $(options.groupSelector).val(),
					orderKey: $(options.orderSelector).val(),
					familyKey: $(options.familySelector).val(),
					keywords: $(options.keywordsSelector).val()
				};

				$.getJSON(source, parameters, function (json) {
					// On Success of the call, transform some of the data and call the specified callback
					// Transforms are to transform returned data into DataTable expected format so paging
					// will work properly.
					json.draw = parameters.i;
					json.recordsTotal = json.resultCount;
					json.recordsFiltered = json.resultCount;
					
                    

					if (parameters.groupKey.length == 0) {
				        wmis.global.appendDataToSelect(json.filters.groups, $(options.groupSelector));
					}

					if (parameters.orderKey == null ||  parameters.orderKey.length == 0) {
					    wmis.global.appendDataToSelect(json.filters.orders, $(options.orderSelector));
				    }

					if (parameters.familyKey == null || parameters.familyKey.length == 0) {
				        wmis.global.appendDataToSelect(json.filters.families, $(options.familySelector));
				    }

				    callback(json);
				}).fail(wmis.global.ajaxErrorHandler);
			},
			"fnDrawCallback": function () {
				bioDiversityTable.$('tr.info').removeClass('info');
				$(options.editButtonSelector).addClass('disabled');
				$(options.decisionButtonSelector).addClass('disabled');

				$(options.biodiversitySelector + " tbody tr").click(function () {
					// Highlight selected row
					if ($(this).hasClass('info')) {
						$(this).removeClass('info');
						$(options.editButtonSelector).addClass('disabled');
						$(options.decisionButtonSelector).addClass('disabled');
					} else {
						bioDiversityTable.$('tr.info').removeClass('info');
						$(this).addClass('info');
						if (bioDiversityTable.$('tr.info').length) {
							// Get Data
							var position = bioDiversityTable.fnGetPosition(this);
							var data = bioDiversityTable.fnGetData(position);

                            if (data.key) {
                                selectedSpecies = data.key

								$(options.editButtonSelector).removeClass('disabled');
								$(options.editButtonSelector).prop("href", "/BioDiversity/Edit/" + data.key + "?commonName=" + data.commonName);
								$(options.decisionButtonSelector).removeClass('disabled');
                                $(options.decisionButtonSelector).prop("href", "/BioDiversity/Decision/" + data.key);
                                $(options.deleteButtonSelector).removeClass('disabled btn-default').addClass('btn-danger');
							}
						}
					}
				});
			}
		});
	}

	return {
		initialize: initialize
	};
}(jQuery));