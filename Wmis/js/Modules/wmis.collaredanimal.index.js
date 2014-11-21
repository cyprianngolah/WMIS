wmis.collaredanimal = wmis.collaredanimal || {};
wmis.collaredanimal.index = (function($) {
	var collarTable;
	var options = {
		searchButtonSelector: "#searchButton",
		editButtonSelector: "#editButton",
		keywordsSelector: "#keywords",
		collarSelector: "#collar",
	    regionSelector: "#region"
	};

	function initialize(initOptions) {
		$.extend(options, initOptions);

		initDataTable();

//		wmis.global.getDropDownData(self.collarRegions, "/api/collar/region?startRow=0&rowCount=500", function (result) { return result.data; });

		wmis.global.loadAndInitializeSelect2($(options.regionSelector), "/api/collar/region?startRow=0&rowCount=500", "Regions", true, "data");

		$(options.keywordsSelector).keyup(function (e) {
			if (e.keyCode == 13) {
				collarTable.fnFilter();
			}
		});

		$(options.searchButtonSelector).click(function () {
			collarTable.fnFilter();
		});
	}
	
	function initDataTable() {
		var parameters;
		collarTable = $(options.collarSelector).dataTable({
			"iDisplayLength": 25,
			"scrollX": true,
			"bJQueryUI": true,
			"bProcessing": true,
			"serverSide": true,
			"ajaxSource": "/api/collar/",
			"pagingType": "bootstrap",
			"dom": '<"top">rt<"bottom"ip><"clear">',
			"columns": [
				{ "data": "collarId" },
				{ "data": "collarType.name" },
                { "data": "collarState.name" },
                { "data": "collarStatus.name" },
                { "data": "vhfFrequency" },
                { "data": "animalId" },
				{ "data": "project.key" },
				{ "data": "project.name" },
			    {
			         "data": "inactiveDate",
				    "render": function (data, type, row) {
				        var date = moment.utc(data, moment.ISO_8601).local();
                        if (date.isValid()) {
                            return date.format('L h:mm a');
                        } else {
                            return '';
                        }
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
					keywords: $(options.keywordsSelector).val(),
				    regionKey: $(options.regionSelector).val(),
				};

				$.getJSON(source, parameters, function (json) {
					// On Success of the call, transform some of the data and call the specified callback
					// Transforms are to transform returned data into DataTable expected format so paging
					// will work properly.
					json.draw = parameters.i;
					json.recordsTotal = json.resultCount;
					json.recordsFiltered = json.resultCount;
					callback(json);
				}).fail(wmis.global.ajaxErrorHandler);
			},
			"fnDrawCallback": function () {
				collarTable.$('tr.info').removeClass('info');
				$(options.editButtonSelector).addClass('disabled');

				$(options.collarSelector + " tbody tr").click(function () {
					// Highlight selected row
					if ($(this).hasClass('info')) {
						$(this).removeClass('info');
						$(options.editButtonSelector).addClass('disabled');
					} else {
						collarTable.$('tr.info').removeClass('info');
						$(this).addClass('info');
						if (collarTable.$('tr.info').length) {
							// Get Data
							var position = collarTable.fnGetPosition(this);
							var data = collarTable.fnGetData(position);

							if (data.key) {
								$(options.editButtonSelector).removeClass('disabled');
								$(options.editButtonSelector).prop("href", "/CollaredAnimal/Edit/" + data.key);
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