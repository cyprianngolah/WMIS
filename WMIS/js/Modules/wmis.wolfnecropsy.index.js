wmis.wolfnecropsy = wmis.wolfnecropsy || {};
wmis.wolfnecropsy.index = (function ($) {
    var wolfNecropsyTable;
    var selectedWolfNecropsy; 
    var options = {
        $newButton: $("#newButton"),
        $editButton: $("#editButton"),
        $downloadButton: $("#downloadButton"),
        $deleteButtonSelector: ("#deleteNecropsyButton"),

        $necropsyId: $("#necropsyId"),
        $commonName: $("#commonName"),
        $location: $("#location"),
        $keywords: $("#keywords"),
        $searchButton: $("#searchButton"), 

       // $table: $("#wolfnecropsy"),
    };

    options.$downloadButton.on("click", function () {
        var keywords = options.$keywords.val()
        var pnecropsyId = options.$necropsyId.val()
        var pcommonName = options.$commonName.val()
        var plocation = options.$location.val()
        var url = `/api/wolfnecropsy/download/?necropsyId=${pnecropsyId}&comonName=${pcommonName}&location=${plocation}&keywords=${keywords}`

        window.open(url, '_blank'); 
    });

    function wolfNecropsyModel() {
        var self = this;
       
        self.removeWolfNecropsy = function () {

            if (selectedWolfNecropsy) {
                var result = confirm("Are you sure you want to delete this record? Note that if the record is deleted it will be removed from the database and you will have to re-enter it again if you still want it.");
                if (result) {

                    wmis.global.showWaitingScreen("Deleting...");

                    $.ajax({
                        url: "/api/wolfnecropsy/Edit/" +selectedWolfNecropsy,
                        type: "DELETE",
                    }).success(function () {
                        window.location.href = "/wolfnecropsy";
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

        document.title = "Wolf Necropsy";

            

        options.$necropsyId.keyup(function (e) {
            if (e.keyCode == 13) {
                wolfNecropsyTable.fnFilter();
            }
        });

        options.$commonName.keyup(function (e) {
            if (e.keyCode == 13) {
                wolfNecropsyTable.fnFilter();
            }
        });

        options.$location.keyup(function (e) {
            if (e.keyCode == 13) {
                wolfNecropsyTable.fnFilter();
            }
        });

        options.$searchButton.click(function () {
             wolfNecropsyTable.fnFilter();
        });

        // add wolfnecropsy model to bind to click events
        var model = new wolfNecropsyModel();
        ko.applyBindings(model);

    }

    function initDataTable() {
        var parameters;
            wolfNecropsyTable = $('#wolfNecropsy').dataTable({
                "iDisplayLength": 25,
                "scrollX": true,
                "bJQueryUI": true,
                "bProcessing": true,
                "serverSide": true,
                "ajaxSource": "/api/wolfnecropsy/",
                "pagingType": "bootstrap",
                "dom": '<"top">rt<"bottom"ip><"clear">',

                "columns": [
                    { "data": "key" },
                    { "data": "necropsyId" },
                    {
                        "data": "necropsyDate",
                        "render": function (data, type, row) {
                            if (typeof (data) != 'undefined' && data != null)
                                return moment(data, moment.ISO_8601).format('L');
                            else
                                return "";
                        }
                    },
                    { "data": "commonName" },
                    { "data": "location" },
                    { "data": "generalComments" },
                    { "data": "submitter" },

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
                        necropsyId: options.$necropsyId.val(),
                        commonName: options.$commonName.val(),
                        location: options.$location.val(),
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
                    wolfNecropsyTable.$('tr.info').removeClass('info');
                    $("#editButton").addClass('disabled');
                    $("#wolfNecropsy tbody tr").click(function () {
                        // Highlight selected row
                        if ($(this).hasClass('info')) {
                            $(this).removeClass('info');
                            $("#editButton").addClass('disabled');
                        } else {
                            wolfNecropsyTable.$('tr.info').removeClass('info');
                            $(this).addClass('info');
                            if (wolfNecropsyTable.$('tr.info').length) {
                                // Get Data
                                var position = wolfNecropsyTable.fnGetPosition(this);
                                var data = wolfNecropsyTable.fnGetData(position);

                                if (data.key) {
                                    selectedWolfNecropsy = data.key;
                                    $("#editButton").removeClass('disabled');
                                    $("#editButton").prop("href", "/WolfNecropsy/Edit/" + data.key);
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