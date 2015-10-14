wmis.shared = wmis.shared || {};
wmis.shared.filetab = (function($) {
    var options = {
        parentTableKey: null,
        parentTableName: null
    };

    var fileTableSelector = "#fileTable";

    function EditFileModel(file) {
        var self = this;
        this.name = ko.observable(file.name || "");
        this.path = ko.observable(file.path || "");
        this.key = ko.observable(file.key || 0);

        this.title = self.key() > 0 ? "Edit Link" : "Add Link";

        this.saveAllowed = ko.computed(function () {
            return !!self.name() && !!self.path();
        });

        this.save = function () {
            self.modal.close({
                key: self.key(),
                name: self.name(),
                path: self.path()
            });
        };

        this.cancel = function () {
            self.modal.close();
        };
    }

    function initializeFileTable() {
        $(fileTableSelector).DataTable({
            "iDisplayLength": 25,
            "ordering": false,
            "bJQueryUI": true,
            "bProcessing": true,
            "pagingType": "bootstrap",
            "serverSide": true,
            "dom": '<"top">rt<"bottom"ip><"clear">',
            "columns": [
                { "data": "name" },
                {
                    "data": "path",
                    "render": function (data, type, row, meta) {
                        return '<a href="' + data + '">' + data + '</a>';
                    }
                },
                {
                    "data": null,
                    "width": "40px",
                    "className": "editFile",
                    "render": function(data, type, row, meta) {
                        return '<span class="glyphicon glyphicon-edit" data-row-index="' + meta.row + '"/>';
                    }
                },
                {
                    "data": null,
                    "width": "40px",
                    "className": "deleteFile",
                    "render": function(data, type, row, meta) {
                        return '<span class="glyphicon glyphicon-remove" data-row-index="' + meta.row + '"/>';
                    }
                }
            ],
            searching: false,
            "ajax": function(data, callback, settings) {
                var parameters = {
                    // Data Tables parameter transforms
                    startRow: data.start,
                    rowCount: data.length,
                    table: options.parentTableName,
                    key: options.parentTableKey
                };
                $.getJSON("/api/file/", parameters, function(json) {
                    var result = {
                        data: json.data,
                        draw: data.draw,
                        recordsTotal: json.resultCount,
                        recordsFiltered: json.resultCount
                    };
                    callback(result);
                });
            },
        });
    }

    function wireEditButtons() {
        $(fileTableSelector).on('click', 'td.editFile span', function (event) {
            var rowIndex = $(event.target).data().rowIndex;
            var rowData = $(fileTableSelector).DataTable().row(rowIndex).data();
            showEditFileModal(rowData);
        });
    }

    function wireDeleteButtons() {
        $(fileTableSelector).on('click', 'td.deleteFile span', function (event) {
            var rowIndex = $(event.target).data().rowIndex;
            var rowData = $(fileTableSelector).DataTable().row(rowIndex).data();
            promptDeleteFile(rowData);
        });
    }

    function promptDeleteFile(file) {
        wmis.global.showWaitingScreen("Deleting...");
        $.ajax({
            url: "/api/file/" + file.key,
            type: "DELETE",
        }).success(function () {
            reloadTable();
        }).always(function () {
            wmis.global.hideWaitingScreen();
        }).fail(function (f) {
            wmis.global.ajaxErrorHandler(f);
        });
    }

    function showEditFileModal(file) {
        var viewModel = new EditFileModel(file);

        return wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'editFileTemplate'
        }).fail(function() {
        }).done(saveEditedFile);
    }

    function saveEditedFile(file) {
        wmis.global.showWaitingScreen("Saving...");
        $.ajax({
            url: "/api/file/",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(file)
        }).success(function () {
            reloadTable();
        }).always(function () {
            wmis.global.hideWaitingScreen();
        }).fail(function (f) {
            wmis.global.ajaxErrorHandler(f);
        });
    }
    
    function showNewFileModal(e) {
        e.preventDefault();
        var viewModel = new EditFileModel({});

        return wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'editFileTemplate'
        }).fail(function() {
        });
    }

    function saveNewFile(file) {
        file.parentTableName = options.parentTableName;
        file.parentTableKey = options.parentTableKey;
        wmis.global.showWaitingScreen("Saving...");
        $.ajax({
            url: "/api/file/",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(file)
        }).success(function () {
            reloadTable();
        }).always(function () {
            wmis.global.hideWaitingScreen();
        }).fail(function (f) {
            wmis.global.ajaxErrorHandler(f);
        });
    }

    function reloadTable() {
        $(fileTableSelector).DataTable().ajax.reload();
    }

    function FileManagementModel() {
        this.addFile = showNewFileModal;
    }

    function afterRender() {
        initializeFileTable();
        wireEditButtons();
        wireDeleteButtons();

        $("#addFileButton").click(showNewFileModal);
    }

    function initialize(key, table, div) {
        options.parentTableKey = key;
        options.parentTableName = table;
        var viewModel = new FileManagementModel(key, table);
        
        ko.renderTemplate(
            'fileManagementTemplate',
            viewModel,
            { afterRender: afterRender },
            document.getElementById(div),
            "replaceNode"
        );
	}
	
	return {
		initialize: initialize
	};
}(jQuery));