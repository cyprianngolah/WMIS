wmis.reference = wmis.reference || {};
wmis.reference.index = (function ($) {
	var referenceTable;
	var options = {
	    yearSelector: "#yearFilter"
	};

	function initDataTable() {
	    var parameters;
	    referenceTable = $('#reference').dataTable({
	        "iDisplayLength": 20,
	        "scrollX": true,
	        "bJQueryUI": true,
	        "bProcessing": true,
	        "serverSide": true,
	        "ajaxSource": "/api/references/",
	        "pagingType": "bootstrap",
	        "dom": '<"top">rt<"bottom"ip><"clear">',
	        "columns": [
				{ "data": "key" },
				{ "data": "code" },
				{ "data": "author" },
				{ "data": "year" },
				{ "data": "title" },
				{ "data": "editionPublicationOrganization" },
				{ "data": "volumePage" },
				{ "data": "publisher" },
				{ "data": "city" },
				{ "data": "location" }
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
	                keywords: $("#keywords").val(),
	                yearFilter: $(options.yearSelector).val()
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
	            referenceTable.$('tr.info').removeClass('info');
	            $("#editButton").addClass('disabled');

	            $("#reference tbody tr").click(function () {
	                // Highlight selected row
	                if ($(this).hasClass('info')) {
	                    $(this).removeClass('info');
	                    $("#editButton").addClass('disabled');
	                } else {
	                    referenceTable.$('tr.info').removeClass('info');
	                    $(this).addClass('info');
	                    if (referenceTable.$('tr.info').length) {
	                        // Get Data
	                        var position = referenceTable.fnGetPosition(this);
	                        var data = referenceTable.fnGetData(position);

	                        if (data.key) {
	                            $("#editButton").removeClass('disabled');
	                            $("#editButton").prop("href", "/Reference/Edit/" + data.key);
	                        }
	                    }
	                }
	            });
	        }
	    });
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);


		wmis.global.loadAndInitializeSelect2($(options.yearSelector), "/api/references/years", "Years");
		initDataTable();

		$("#keywords").keyup(function(e) {
			e.stopPropagation();
			if (e.keyCode == 13) {
				referenceTable.fnFilter();
			}
		});

		$("#searchButton").click(function (e) {
			e.stopPropagation();
			referenceTable.fnFilter();
		});
		
		referenceTable.fnFilter();
	}
	

	return {
		initialize: initialize
	};
}(jQuery));