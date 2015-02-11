wmis.project = wmis.project || {};
wmis.project.index = (function ($) {
	var dataTable;
	var options = {
		$newButton: $("#newButton"),
		$editButton: $("#editButton"),
		
		$projectLead: $("#projectLead"),
		$projectStatus: $("#projectStatus"),
		$region: $("#region"),
		$keywords: $("#keywords"),
		$searchButton: $("#searchButton"),

		$table: $("#projects"),
	};

	function initialize(initOptions) {
		$.extend(options, initOptions);

		initDataTable();

		wmis.global.loadAndInitializeSelect2(options.$projectLead, "/api/person/projectLeads/", "Project Lead", true, "data");
		wmis.global.loadAndInitializeSelect2(options.$projectStatus, "/api/project/statuses/", "Project Status",true,"data");
		wmis.global.loadAndInitializeSelect2(options.$region, "/api/leadregion?startRow=0&rowCount=500", "Ecoregion", true, "data");

		options.$keywords.keyup(function (e) {
			if (e.keyCode == 13) {
				dataTable.fnFilter();
			}
		});

		options.$searchButton.click(function () {
			dataTable.fnFilter();
		});
	}

	function initDataTable() {
		var parameters;
		dataTable = options.$table.dataTable({
			"iDisplayLength": 25,
			"scrollX": true,
			"bJQueryUI": true,
			"bProcessing": true,
			"serverSide": true,
			"ajaxSource": "/api/project/",
			"pagingType": "bootstrap",
			"dom": '<"top">rt<"bottom"ip><"clear">',
			"columns": [
				{ "data": "key" },
				{ "data": "name" },
				{ "data": "leadRegion.name" },
				{ "data": "projectLead.name" },
				{ "data": "status.name" },
				{
					"data": "statusDate",
					"render": function (data, type, row) {
						if (typeof (data) != 'undefined' && data != null)
							return moment.utc(data, moment.ISO_8601).format('L');
						else
							return "";
					}
				},
				{
					"data": "startDate",
					"render": function (data, type, row) {
						if (typeof (data) != 'undefined' && data != null)
							return moment.utc(data, moment.ISO_8601).format('L');
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
					projectLead: options.$projectLead.val(),
					projectStatus: options.$projectStatus.val(),
					region: options.$region.val(),
					keywords: options.$keywords.val()
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
				options.$table.$('tr.info').removeClass('info');
				options.$editButton.addClass('disabled');

				options.$table.find("tbody tr").click(function () {
					// Highlight selected row
					if ($(this).hasClass('info')) {
						$(this).removeClass('info');
						
						options.$editButton.addClass('disabled');
					} else {
						options.$table.$('tr.info').removeClass('info');
						$(this).addClass('info');
						if (options.$table.$('tr.info').length) {
							// Get Data
							var position = dataTable.fnGetPosition(this);
							var data = dataTable.fnGetData(position);

							if (data.key) {
								options.$editButton.removeClass('disabled');
								options.$editButton.prop("href", "/Project/Edit/" + data.key);								
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