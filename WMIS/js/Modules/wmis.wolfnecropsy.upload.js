wmis.wolfnecropsy = wmis.wolfnecropsy || {};
wmis.wolfnecropsy.upload = (function ($) {
    var bulkUploadDataTable;
    var selectedFile;

    var options = {
        uploadNecropsyForm: null
    };

    function UploadModel() {
        var self = this;

        self.currentModal = ko.observable("");

        self.showUploadModal = function () {
            self.currentModal("upload");
        };

        self.hideUploadModal = function () {
            self.currentModal("");
        };

        self.uploadObservationFile = function () {
            wmis.global.showWaitingScreen("Uploading... Please wait");
            options.uploadNecropsyForm.submit();
        };

        self.downloadSelectedFile = function () {
            //wmis.global.showWaitingScreen("Downloading...");
            window.open("/api/wolfnecropsy/uploads/download?fileName=" + selectedFile, '_blank');
        };
    }
    
    // listens to upload event from upload iframe.
    function addEventHandlers(viewModel) {
        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from upload iframe
        eventer(messageEvent, function (event) {
            if (event.origin.indexOf(location.hostname) == -1) {
                alert('Origin not allowed! ' + event.origin + " != " + location.hostname);
                return;
            }
            if (event.data.indexOf("observationUploadError:") == 0) {
                var message = event.data.replace("observationUploadError:", "");
                viewModel.showMessageModal(message);
            }
            if (event.data.indexOf("FileDownloadError:") == 0) {
                var message = event.data.replace("FileDownloadError:", "");
                viewModel.showMessageModal(message);
            }
            else if (event.data.indexOf("wolfnecropsyBulkUpload") == 0) {
                viewModel.hideUploadModal();
                // add redirection or function to fetch uploads (for now just redirect back to the upload page)
                window.location.href = "/Wolfnecropsy/Upload";
            }
        }, false);
    }



    function initialize(initOptions) {
        $.extend(options, initOptions);
        // init datatables
        initDataTable();
        bulkUploadDataTable.fnFilter();


        // Handle upload events
        var model = new UploadModel();
        ko.applyBindings(model);
        addEventHandlers(model);
    }

    function initDataTable() {
        var parameters;
        bulkUploadDataTable = $('#bulkUploadTable').dataTable({
            "iDisplayLength": 20,
            "scrollX": true,
            "bJQueryUI": true,
            "bProcessing": true,
            "serverSide": true,
            "ajaxSource": "/api/wolfnecropsy/uploads/",
            "pagingType": "bootstrap",
            "dom": '<"top">rt<"bottom"ip><"clear">',
            "columns": [
                { "data": "originalFileName" },
                { "data": "uploadType" },
                {
                    "data": "createdAt", // Date Created
                    "render": function (data, type, row) {
                        var date = moment(data, moment.ISO_8601).local().format('L h:mm a');
                        return date;
                    }
                }
                //{ "data": "filePath" }
            ],
            //"rowCallback": function (row, data, index) {
            //$('td:eq(3)', row).html('<a href="/api/wolfnecropsy/uploads/download?fileName='+data.fileName+'">Download file</a>');
            //   $('td:eq(3)', row).html('<a href="javascript:downloadFile()">Download file</a>');
            //},
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
                bulkUploadDataTable.$('tr.info').removeClass('info');
                //$("#editButton").addClass('disabled');

                $("#bulkUploadTable tbody tr").click(function () {
                    // Highlight selected row
                    if ($(this).hasClass('info')) {
                        $(this).removeClass('info');
                        //$("#editButton").addClass('disabled');
                    } else {
                        bulkUploadDataTable.$('tr.info').removeClass('info');
                        $(this).addClass('info');
                        if (bulkUploadDataTable.$('tr.info').length) {
                            // Get Data
                            var position = bulkUploadDataTable.fnGetPosition(this);
                            var data = bulkUploadDataTable.fnGetData(position);

                            if (data.key) {
                                $("#downloadSelectedButton").removeClass('disabled').addClass('btn-success');
                                selectedFile = data.fileName;
                                //console.log(selectedFile);
                                //$("#downloadSelectedButton").prop("href", "/api/wolfnecropsy//Edit/" + data.key);
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