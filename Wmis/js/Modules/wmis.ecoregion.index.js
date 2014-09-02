wmis.ecoregion = wmis.ecoregion || {};
wmis.ecoregion.index = (function ($) {
	var ecoregionTable;
	var options = {

	};

	function initialize(initOptions) {
		$.extend(options, initOptions);

		initDataTable();

		$("#keywords").keyup(function (e) {
			if (e.keyCode == 13) {
				ecoregionTable.fnFilter();
			}
		});

		$("#searchButton").click(function () {
			ecoregionTable.fnFilter();
		});
	}

	function initDataTable() {
		var parameters;
		ecoregionTable = $('#ecoregion').dataTable({
			"iDisplayLength": 20,
			"scrollX": true,
			"bJQueryUI": true,
			"bProcessing": true,
			"serverSide": true,
			"ajaxSource": "/api/ecoregion",
			"pagingType": "bootstrap",
			"dom": '<"top">rt<"bottom"ip><"clear">',
			"columns": [
				{ "data": "key" },
				{ "data": "name" }
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
					keywords: $("#keywords").val()
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
				ecoregionTable.$('tr.info').removeClass('info');
				$("#editButton").addClass('disabled');

				$("#ecoregion tbody tr").click(function () {
					// Highlight selected row
					if ($(this).hasClass('info')) {
						$(this).removeClass('info');
						$("#editButton").addClass('disabled');
					} else {
						ecoregionTable.$('tr.info').removeClass('info');
						$(this).addClass('info');
						if (ecoregionTable.$('tr.info').length) {
							// Get Data
							var position = ecoregionTable.fnGetPosition(this);
							var data = ecoregionTable.fnGetData(position);

							if (data.key) {
								$("#editButton").removeClass('disabled');
								$("#editButton").prop("href", "/Ecoregion/Edit/" + data.key);
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