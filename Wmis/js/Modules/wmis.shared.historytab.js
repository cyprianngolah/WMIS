wmis.shared = wmis.shared || {};
wmis.shared.historytab = (function($) {
    var options = {
        parentTableKey: null,
        parentTableName: null
    };

    var historyTableSelector = "#historyLogTable";
    
    function HistoryModel() {
        var self = this;
        this.historyFilterOptions = ko.observableArray([""]);
        this.historyOptionSelection = ko.observable("");

        this.historyOptionSelection.subscribe(function () {
            $(historyTableSelector).DataTable().ajax.reload();
        });
    }

    function initializeHistoryTable(historyModel) {

        $(historyTableSelector).DataTable({
            "iDisplayLength": 25,
            "ordering": false,
            "bJQueryUI": true,
            "bProcessing": true,
            "pagingType": "bootstrap",
            "serverSide": true,
            "dom": '<"top">rt<"bottom"ip><"clear">',
            "columns": [
                {
                    "data": "changeDate",
                    "render": function (data, type, row) {
                        var date = moment(data, moment.ISO_8601).local().format('L h:mm a');
                        return date;
                    }
                },
                { "data": "item" },
                { "data": "value" },
                { "data": "changeBy" },
                { "data": "comment" },
                {
                    "data": null,
                    "width": "40px",
                    "className": "editHistory",
                    "render": function (data, type, row, meta) {
                        return '<span class="glyphicon glyphicon-edit" data-row-index="' + meta.row + '"/>';
                    }
                }
            ],
            searching: false,
            "ajax": function (data, callback, settings) {
                var parameters = {
                    // Data Tables parameter transforms
                    startRow: data.start,
                    rowCount: data.length,
                    table: options.parentTableName,
                    key: options.parentTableKey
                };

                //Check Filter
                var filterValue = historyModel.historyOptionSelection();
                if (filterValue) parameters.filter = filterValue;

                $.getJSON("/api/history", parameters, function (json) {
                    var result = {
                        data: json.data,
                        draw: data.draw,
                        recordsTotal: json.resultCount,
                        recordsFiltered: json.resultCount
                    };
                    callback(result);
                });
            },
            initComplete: function (settings, json) {
                //var data = $.unique(this.api().column(1).data().toArray()).sort();
                //$.each(data, function (index, value) {
                //    historyModel.historyFilterOptions.push(value);
                //});
            }
        });

        historyModel.historyFilterOptions.subscribe(function () {
            $(historyTableSelector).DataTable().ajax.reload();
        });
    }

    function wireEditButtons() {
        $(historyTableSelector).on('click', 'td.editHistory span', function (event) {
            var rowIndex = $(event.target).data().rowIndex;
            var rowData = $(historyTableSelector).DataTable().row(rowIndex).data();
            editHistoryComment(rowData);
        });
    }

    function populateHistoryFilters(viewmodel) {
        $.getJSON("/api/history/filterTypes?parentTableKey=" + options.parentTableKey + "&parentTableName=" + options.parentTableName, {}, function (json) {
            $.each(json, function (index, value) {
                viewmodel.historyFilterOptions.push(value.item);
            });
        }).fail(wmis.global.ajaxErrorHandler);
    }
    
    function saveEditedHistory(history) {
        wmis.global.showWaitingScreen("Saving...");
        $.ajax({
            url: "/api/history/",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(history)
        }).success(function () {
            reloadTable();
        }).always(function () {
            wmis.global.hideWaitingScreen();
        }).fail(function (f) {
            wmis.global.ajaxErrorHandler(f);
        });
    }
    
    function reloadTable() {
        $(historyTableSelector).DataTable().ajax.reload();
    }
    
    function EditHistoryCommentModel(selectedHistoryItem) {
        var self = this;
        this.item = selectedHistoryItem.item;
        this.value = selectedHistoryItem.value;
        this.changeDate = selectedHistoryItem.changeDate;
        this.comment = ko.observable(selectedHistoryItem.comment);

        this.save = function () {
            selectedHistoryItem.comment = self.comment();
            self.modal.close(selectedHistoryItem);
        };

        this.cancel = function () {
            self.modal.close();
        }
    }

    function editHistoryComment(selectedHistoryItem) {
        var viewModel = new EditHistoryCommentModel(selectedHistoryItem);

        wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'editHistoryCommentTemplate'
        }).fail(function() {
            console.log("Modal cancelled");
        }).done(saveEditedHistory);
    }

    function afterRender(viewmodel) {
        initializeHistoryTable(viewmodel);
        wireEditButtons();
        populateHistoryFilters(viewmodel);
    }

    function initialize(key, table, div) {
        options.parentTableKey = key;
        options.parentTableName = table;
        var viewModel = new HistoryModel();

        ko.renderTemplate(
            'historyManagementTemplate',
            viewModel,
            {
                afterRender: function () {
                    afterRender(viewModel);
                }
            },
            document.getElementById(div),
            "replaceNode"
        );
	}
	
	return {
		initialize: initialize
	};
}(jQuery));