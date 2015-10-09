wmis.search = wmis.search || {};
wmis.search.index = (function ($) {
    var searchTable;
    var options = {
        fromSelector: "#fromDate",
        toSelector: "#toDate",
        speciesSelector: "#speciesIds",
        nwtSaraSelector: "#nwtSaraIds",
        fedSaraSelector: "#fedSaraIds",
        generalRankSelector: "#generalStatusIds",
        nwtSarcSelector: "#nwtSarcIds",
        surveyTypeSelector: "#surveyTypeIds",
        topLatitudeSelector: "#topLatitude",
        topLongitudeSelector: "#topLongitude",
        bottomLatitudeSelector: "#bottomLatitude",
        bottomLongitudeSelector: "#bottomLongitude"
    };

    function SearchModel() {
        var self = this;

        this.fromDate = ko.observable();
        this.toDate = ko.observable();
        this.speciesIds = ko.observableArray();

        this.speciesOptions = ko.observable();
        this.speciesOptions({
            valueObservable: self.speciesIds,
            idProperty: 'key',
            textFieldNames: ['commonName'],
            url: '/api/biodiversity',
            placeholder: 'Species...'
        });

        this.nwtSaraOptions = ko.observable();
        this.nwtSaraOptions({
            valueObservable: self.speciesIds,
            idProperty: 'key',
            textFieldNames: ['name'],
            url: '/api/biodiversity/nwtSaraStatuses',
            placeholder: 'Species...'
        });

        this.fedSaraOptions = ko.observable();
        this.fedSaraOptions({
            valueObservable: self.speciesIds,
            idProperty: 'key',
            textFieldNames: ['name'],
            url: '/api/biodiversity/fedSaraStatuses',
            placeholder: 'Species...'
        });

        this.rankOptions = ko.observable();
        this.rankOptions({
            valueObservable: self.speciesIds,
            idProperty: 'key',
            textFieldNames: ['name'],
            url: '/api/biodiversity/statusRanks',
            placeholder: 'Species...'
        });

        this.sarcOptions = ko.observable();
        this.sarcOptions({
            valueObservable: self.speciesIds,
            idProperty: 'key',
            textFieldNames: ['name'],
            url: '/api/biodiversity/nwtSarcAssessments',
            placeholder: 'NWT SARC Assessments...'
        });

        this.surveyTypes = ko.observable();
        this.surveyTypes({
            valueObservable: self.speciesIds,
            idProperty: 'key',
            textFieldNames: ['name'],
            url: '/api/biodiversity/surveyTypes',
            placeholder: 'Survey Types...'
        });
    }

    function setHighlightRowForKey(key, enable) {
        var row = $("#searchTable").DataTable().rows(function (idx, data, node) {
            return data.key == key;
        });
        if (enable) {
            $(row.nodes()).addClass('info');
        } else {
            $(row.nodes()).removeClass('info');
        }
    }
    
    function initialize(initOptions) {
        $.extend(options, initOptions);
        
        document.title = "WMIS Search";
        function SearchMapModel() {
            var self = this;

            this.mapData = ko.observableArray();
            this.mapSelected = ko.observable();

            this.reviewPass = function (pass) {
                self.mapSelected(pass);
            };

            // Handle highlighting the selected row
            (function () {
                var currentKey = null;
                self.mapSelected.subscribe(function (newPass) {
                    if (currentKey) {
                        setHighlightRowForKey(currentKey, false);
                        currentKey = null;
                        $("#editButton").addClass('disabled');
                    }
                    if (newPass) {
                        currentKey = newPass.key;
                        setHighlightRowForKey(currentKey, true);

                        if (newPass.key) {
                            $("#editButton").removeClass('disabled');
                            $("#editButton").prop("href", "/Project/Edit/" + newPass.projectKey);
                        }
                    }
                });
            })();
        };
    
        var mapModel = new SearchMapModel();

        var mappingCallback = function (jsonData) {
            mapModel.mapData(jsonData);
        };

        var rowSelectCallback = function (data) {
            mapModel.mapSelected(data);
        };

        initDataTable(mappingCallback, rowSelectCallback);

        $("#searchButton").click(function () {
            searchTable.fnFilter();
        });

        var viewModel = new SearchModel();
        ko.applyBindings(viewModel);

        wmis.mapping.initialize(mapModel.mapData, mapModel.mapSelected, mapModel.reviewPass, null, null, true);
    }

    function initDataTable(mappingCallback, rowSelectCallback) {
        var parameters;

        searchTable = $('#searchTable').dataTable({
            "iDisplayLength": 50,
            "scrollX": true,
            "bJQueryUI": true,
            "bProcessing": true,
            "serverSide": true,
            "pagingType": "bootstrap",
            "iDeferLoading": 57,
            "dom": '<"top">rt<"bottom"ip><"clear">',
            "columns": [
				{ "data": "key" },
	            { "data": "projectKey" },
				{ "data": "species" },
				{
				    "data": "date",
				    "render": function (data, type, row) {
				        if (typeof (data) != 'undefined' && data != null)
				            return moment.utc(data, moment.ISO_8601).format('LLL');
				        else
				            return "";
				    }
				},
				{ "data": "latitude" },
				{ "data": "longitude" },
				{ "data": "surveyType" },
				{ "data": "animalId" },
				{ "data": "herd" },
				{ "data": "sex" }
            ],
            searching: true,
            "ajax": function (data, callback, settings) {
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
                    fromDate: $(options.fromSelector).val(),
                    toDate: $(options.toSelector).val(),
                    speciesIds: JSON.parse("[" + $(options.speciesSelector).val() + "]"),
                    nWTSaraStatusIds: JSON.parse("[" + $(options.nwtSaraSelector).val() + "]"),
                    federalSaraStatusIds: JSON.parse("[" + $(options.fedSaraSelector).val() + "]"),
                    generalRankStatusIds: JSON.parse("[" + $(options.generalRankSelector).val() + "]"),
                    nwtSarcAssessmentIds: JSON.parse("[" + $(options.nwtSarcSelector).val() + "]"),
                    surveyTypeIds: JSON.parse("[" + $(options.surveyTypeSelector).val() + "]"),
                    topLatitude: $(options.topLatitudeSelector).val(),
                    topLongitude: $(options.topLongitudeSelector).val(),
                    bottomLatitude: $(options.bottomLatitudeSelector).val(),
                    bottomLongitude: $(options.bottomLongitudeSelector).val()
                };

                $.getJSON("/api/search", parameters, function (json) {
                    // On Success of the call, transform some of the data and call the specified callback
                    // Transforms are to transform returned data into DataTable expected format so paging
                    // will work properly.
                    json.draw = parameters.i;
                    json.recordsTotal = json.resultCount;
                    json.recordsFiltered = json.resultCount;
                    callback(json);
	                mappingCallback(json.data);

                }).fail(wmis.global.ajaxErrorHandler);
            },
            "fnDrawCallback": function (oSettings) {
                if (oSettings.aiDisplay.length == 0) {
                    return;
                }

                searchTable.$('tr.info').removeClass('info');
                $("#editButton").addClass('disabled');

                $("#searchTable tbody tr").click(function () {
                    // Highlight selected row
                    if ($(this).hasClass('info')) {
                        $(this).removeClass('info');
                        $("#editButton").addClass('disabled');
                        rowSelectCallback(null);
                    } else {
                        searchTable.$('tr.info').removeClass('info');
                        $(this).addClass('info');
                        if (searchTable.$('tr.info').length) {
                            // Get Data
                            var position = searchTable.fnGetPosition(this);
                            var data = searchTable.fnGetData(position);
                            if (data.projectKey) {
                                $("#editButton").removeClass('disabled');
                                $("#editButton").prop("href", "/Project/Edit/" + data.projectKey);
                            }

                            rowSelectCallback(data);
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