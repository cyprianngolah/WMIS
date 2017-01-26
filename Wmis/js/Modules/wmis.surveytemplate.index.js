wmis.surveytemplate = wmis.surveytemplate || {};
wmis.surveytemplate.index = (function ($) {
	var surveyDataTable;
	var options = {
		
	};

	function initialize(initOptions) {
		$.extend(options, initOptions);

		initDataTable();

		$("#keywords").keyup(function(e) {
			e.stopPropagation();
			if (e.keyCode == 13) {
				surveyDataTable.fnFilter();
			}
		});

		$("#searchButton").click(function (e) {
			e.stopPropagation();
			surveyDataTable.fnFilter();
		});
		
		surveyDataTable.fnFilter();
	}
	
	function initDataTable() {
		var parameters;
		surveyDataTable = $('#surveyTemplateTable').dataTable({
			"iDisplayLength": 20,
			"scrollX": true,
			"bJQueryUI": true,
			"bProcessing": true,
			"serverSide": true,
			"ajaxSource": "/api/surveytemplate/",
			"pagingType": "bootstrap",
			"dom": '<"top">rt<"bottom"ip><"clear">',
			"columns": [
				{ "data": "name" },
			    { "data": "projectCount" },
                { "data": "createdBy" },
                {
				    "data": "dateCreated", // Date Created
				    "render": function (data, type, row) {
		                var date = moment(data, moment.ISO_8601).local().format('L h:mm a');
		                return date;
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
			"fnDrawCallback": function() {
				surveyDataTable.$('tr.info').removeClass('info');
				$("#editButton").addClass('disabled');

				$("#surveyTemplateTable tbody tr").click(function () {
					// Highlight selected row
					if ($(this).hasClass('info')) {
						$(this).removeClass('info');
						$("#editButton").addClass('disabled');
					} else {
						surveyDataTable.$('tr.info').removeClass('info');
						$(this).addClass('info');
						if (surveyDataTable.$('tr.info').length) {
							// Get Data
							var position = surveyDataTable.fnGetPosition(this);
							var data = surveyDataTable.fnGetData(position);

							if (data.key) {
								$("#editButton").removeClass('disabled');
								$("#editButton").prop("href", "/SurveyTemplate/Edit/" + data.key);
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