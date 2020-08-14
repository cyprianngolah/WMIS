wmis.rabiestests = wmis.rabiestests || {};
wmis.rabiestests.index = (function ($) {
    var rabiesTestsTable;
    var selectedRabiesTest;
    var options = {
        $newButton: $("#newButton"),
        $editButton: $("#editButton"),
        $downloadButton: $("#downloadButton"),
        $deleteButtonSelector: ("#deleteRabiesTestButton"),
        $year: $("#year"),
        $species: $("#species"),
        $community: $("#community"),
        $testResult: $("#testResult"),
        $keywords: $("#keywords"),
        $searchButton: $("#searchButton"),

      //   $table: $("#RabiesTests"),
    };

    options.$downloadButton.on("click", function () {
        var keywords = options.$keywords.val()
        var pyear = options.$year.val()
        var pspecies = options.$species.val()
        var pcommunity = options.$community.val()
        var ptestResult = options.$testResult.val()
        var url = `/api/rabiestests/download/?year=${pyear}&species=${pspecies}&community=${pcommunity}&testResult=${ptestResult}&keywords=${keywords}`

        window.open(url, '_blank');
    });

    function rabiesTestsModel() {
        var self = this;

        self.removeRabiesTest = function () {

            if (selectedRabiesTest) {
                var result = confirm("Are you sure you want to delete this record? Note that if the record is deleted it will be removed from the database and you will have to re-enter it again if you still want it.");
                if (result) {

                    wmis.global.showWaitingScreen("Deleting...");

                    $.ajax({
                        url: "/api/rabiestests/rabies/" + selectedRabiesTest + "/delete/",
                        type: "DELETE",
                    }).success(function () {
                        window.location.href = "/rabiestests";
                    }).always(function () {
                        wmis.global.hideWaitingScreen();
                    }).fail(function (f) {
                        $('#deleteErrorAlert').removeClass('hidden');
                        $('#deleteError').text(f.responseJSON.exceptionMessage);
                        //wmis.global.ajaxErrorHandler(f);
                    });
                }
            }

        }
    }


    function initialize(initOptions) {
        $.extend(options, initOptions);

        initDataTable();

        document.title = "Rabies Tests";



        options.$year.keyup(function (e) {
            if (e.keyCode == 13) {
                rabiesTestsTable.fnFilter();
            }
        });

        options.$species.keyup(function (e) {
            if (e.keyCode == 13) {
                rabiesTestsTable.fnFilter();
            }
        });

        options.$community.keyup(function (e) {
            if (e.keyCode == 13) {
                rabiesTestsTable.fnFilter();
            }
        });

        options.$testReult.keyup(function (e) {
            if (e.keyCode == 13) {
                rabiesTestsTable.fnFilter();
            }
        });

        options.$searchButton.click(function () {
            rabiesTestsTable.fnFilter();
        });

        // add rabiestests model to bind to click events
        var model = new rabiesTestsModel();
        ko.applyBindings(model);

    }

    function initDataTable() {
        var parameters;
        rabiesTestsTable = $('#RabiesTests').dataTable({
            "iDisplayLength": 25,
            "scrollX": true,
            "bJQueryUI": true,
            "bProcessing": true,
            "serverSide": true,
            "ajaxSource": "/api/rabiestests/",
            "pagingType": "bootstrap",
            "dom": '<"top">rt<"bottom"ip><"clear">',

            "columns": [
              //  { "data": "key" },
                {
                    "data": "dateTested",
                    "render": function (data, type, row) {
                        if (typeof (data) != 'undefined' && data != null)
                            return moment(data, moment.ISO_8601).format('L');
                        else
                            return "";
                    }
                },
                { "data": "year" },             
                { "data": "species" },
                { "data": "community" },
                { "data": "testResult" },
                { "data": "latitude" },
                { "data": "longitude" },
                { "data": "comments" },
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
                    year: options.$year.val(),
                    species: options.$species.val(),
                    community: options.$community.val(),
                    testResult: options.$testResult.val(),
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
                rabiesTestsTable.$('tr.info').removeClass('info');
                $("#editButton").addClass('disabled');
                $("#RabiesTests tbody tr").click(function () {
                    // Highlight selected row
                    if ($(this).hasClass('info')) {
                        $(this).removeClass('info');
                        $("#editButton").addClass('disabled');
                    } else {
                        rabiesTestsTable.$('tr.info').removeClass('info');
                        $(this).addClass('info');
                        if (rabiesTestsTable.$('tr.info').length) {
                            // Get Data
                            var position = rabiesTestsTable.fnGetPosition(this);
                            var data = rabiesTestsTable.fnGetData(position);

                            if (data.key) {
                                selectedRabiesTest = data.key;
                                $("#editButton").removeClass('disabled');
                                $("#editButton").prop("href", "/RabiesTests/Edit/" + data.key);
                                $(options.$deleteButtonSelector).removeClass('disabled btn-default').addClass('btn-danger');
                            }
                        }
                    }
                });
            }
        })
    }

    return {
        initialize: initialize
    };
}(jQuery));