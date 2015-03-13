wmis.user = wmis.user || {};
wmis.user.index = (function ($) {
	var userTable;
	var options = {

	};

	function initialize(initOptions) {
		$.extend(options, initOptions);

		initDataTable();

		$("form").on("submit", function(e) {
			e.preventDefault();
		});

		$("#keywords").keyup(function (e) {
			if (e.keyCode == 13) {
				userTable.fnFilter();
			}
		});

		$("#searchButton").click(function () {
			userTable.fnFilter();
		});
	}

	function initDataTable() {
	    var parameters;
	    var booleanRenderer = function(data, type, row, meta) {
	        return data ? "Yes" : "No";
	    };
		userTable = $('#user').dataTable({
			"iDisplayLength": 20,
			"scrollX": true,
			"bJQueryUI": true,
			"bProcessing": true,
			"serverSide": true,
			"ajaxSource": "/api/person/applicationUsers",
			"pagingType": "bootstrap",
			"dom": '<"top">rt<"bottom"ip><"clear">',
			"columns": [
                { "data": "name" },
				{ "data": "username" },
				{
					"data": "roles",
					"render": function(data, type, full, meta) {
						if (data.length > 0) {
							var r = "";
							for (var i = 0; i < data.length; i++) {
								if (i > 0)
									r += ", ";
								r += data[i].name;
							}
							return r;
						} else {
							return "";
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
				userTable.$('tr.info').removeClass('info');
				$("#editButton").addClass('disabled');

				$("#user tbody tr").click(function () {
					// Highlight selected row
					if ($(this).hasClass('info')) {
						$(this).removeClass('info');
						$("#editButton").addClass('disabled');
					} else {
						userTable.$('tr.info').removeClass('info');
						$(this).addClass('info');
						if (userTable.$('tr.info').length) {
							// Get Data
							var position = userTable.fnGetPosition(this);
							var data = userTable.fnGetData(position);

							if (data.key) {
								$("#editButton").removeClass('disabled');
								$("#editButton").prop("href", "/User/Edit/" + data.key);
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