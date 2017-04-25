wmis.collaredanimal = wmis.collaredanimal || {};
wmis.collaredanimal.index = (function($) {
	var collarTable;
	var options = {
		searchButtonSelector: "#searchButton",
		editButtonSelector: "#editButton",
		keywordsSelector: "#keywords",
		collarSelector: "#collar",
	    regionSelector: "#region",
	    needingReviewSelector: "#needingReview",
	    speciesSelector: "#targetSpecies"
	};

	var targetSpeciesOptions = {
	    ajax: {
	        url: "/api/biodiversity",
	        placeholder: "Target Species",
	        dataType: "json",
	        data: function (term, page) {
	            return {
	                searchString: term,
	                startRow: (page - 1) * 25,
	                rowCount: 25
	            };
	        },
	        results: function (result, page, query) {
	            var results = _.map(result.data, function (record) {
	                return {
	                    id: record.key,
	                    text: record.name + (record.commonName ? ' - ' + record.commonName : '')
	                };
	            });
	            return {
	                results: results
	            };
	        }
	    },
	    initSelection: function (element, callback) {
	        // the input tag has a value attribute preloaded that points to a preselected repository's id
	        // this function resolves that id attribute to an object that select2 can render
	        // using its formatResult renderer - that way the repository name is shown preselected
	        var id = $(element).val();
	        if (id !== "") {
	            $.ajax("/api/biodiversity/" + id, {
	                dataType: "json"
	            }).done(function (data) {
	                callback({
	                    id: data.key,
	                    text: data.name + (data.commonName ? ' - ' + data.commonName : '')
	                });
	            });
	        }
	    },
	};
	
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
            "order": [[3,'asc'],[4, 'asc']],
			"columns": [
				{ "data": "animalId" },
				{ "data": "subscriptionId" },
                { "data": "key" },
                { "data": "collarState.name" },
                { "data": "collarStatus.name" },
                {
                    "data": "inactiveDate",
                    "render": function (data, type, row) {
                        var date = moment(data, moment.ISO_8601)
                        if (date.isValid()) {
                            return date.format('L');
                        } else {
                            return '';
                        }
                    }
                },
                { "data": "animalStatus.name" },
                { "data": "vhfFrequency" },
                { "data": "animalSex.name" },
                { "data": "herdPopulation.name" },
			    { "data": "collarType.name" },
				{ "data": "project.key" },
				{ "data": "project.name" }
			],
			"fnServerData": function (source, data, callback, settings) {
				var sortDirection = null;
				var sortedColumnName = null;
				var subSortDirection = null;
				var subSortedColumnName = null;
				if (settings.aaSorting.length > 0) {
					sortDirection = settings.aaSorting[0][1];
					var sortedColumnIndex = settings.aaSorting[0][0];
					sortedColumnName = settings.aoColumns[sortedColumnIndex].mData;
				}
				if (settings.aaSorting.length > 1) {
				    subSortDirection = settings.aaSorting[1][1];
				    var sortedColumnIndex = settings.aaSorting[1][0];
				    subSortedColumnName = settings.aoColumns[sortedColumnIndex].mData;
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
					subSortBy: subSortedColumnName,
                    subSortDirection: subSortDirection,
					i: settings.oAjaxData.sEcho,

					// Custom search data
					keywords: $(options.keywordsSelector).val(),
				    regionKey: $(options.regionSelector).val(),
				    needingReview: $(options.needingReviewSelector).is(':checked'),
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

	function initSpeciesDropdown() {
	    $(options.speciesSelector).select2({
	        placeholder: "Species"
	    });
	    $.ajax({
	        url: "/api/biodiversity/species?startRow=0&rowCount=7000",
	        dataType: "json",
	        type: "GET",
	        xhrFields: {
	            withCredentials: true
	        }
	    }).done(function (result) {
	        $(options.speciesSelector).empty();
	     
	        $(options.speciesSelector).append("<option value=''>All Species</option>");
	        $.each(result.data, function (index, value) {
	            var textval = value.name + (value.commonName ? ' - ' + value.commonName : '');
	            $(options.speciesSelector).append($("<option></option>").attr("value", value.key).text(textval));
	        });
	    }).fail(wmis.global.ajaxErrorHandler);

	    
	}


	function initialize(initOptions) {
	    $.extend(options, initOptions);

	    initDataTable();
	    initSpeciesDropdown();

	    document.title = "WMIS Collared Animal";

	    this.targetSpeciesOptions = targetSpeciesOptions;
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

	return {
		initialize: initialize
	};
}(jQuery));