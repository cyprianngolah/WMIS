wmis.surveytemplate = wmis.surveytemplate || {};
wmis.surveytemplate.edit = (function ($) {
	var options = {
		surveyTemplateKey: null,
	};

	function EditSurveyTemplateColumnModel(columnTypes, existingColumnData) {
	    var self = this;
	    
	    self.columnData = null;
	    if (existingColumnData) {
	        self.columnData = ko.mapper.fromJS(existingColumnData);
	    } else {
	        self.columnData = ko.mapper.fromJS({
	            key: 0,
	            isRequired: false,
	            name: '',
	            order: 0,
	            surveyTemplateId: options.surveyTemplateKey,
	            columnType: {
	                name: '',
	                key: 0
	            }
	        });
	    }

	    this.columnTypeOptions = columnTypes;

        this.saveAllowed = ko.computed(function () {
            return !!self.columnData.name() && !!self.columnData.columnType().key();
        });

        this.save = function () {
            self.modal.close(ko.mapper.toJS(self.columnData));
        };

        this.cancel = function () {
            self.modal.close();
        };
    }

	function columnSortCompareFunction(left, right) {
	    return ko.unwrap(left.order) - ko.unwrap(right.order);
	}

	function createObservableColumns(columns) {
	    var sortedColumns = columns.sort(columnSortCompareFunction);
	    return _.map(sortedColumns, function (column) {
	        return ko.mapper.fromJS(column);
	    });
	}

	function SurveyTemplateViewModel(surveyTemplate, columns, columnTypes) {
		var self = this;
		this.surveyTemplateId = ko.observable(surveyTemplate.key);
		this.name = ko.observable(surveyTemplate.name);
	    this.columns = ko.observableArray(createObservableColumns(columns));
		
        this.requiredColumnFormatter = function(value) {
            return ko.unwrap(value) ? "Yes" : "No";
        }

	    this.canSave = ko.computed(function () {
			return !!self.name();
		});

	    this.projectCount = surveyTemplate.projectCount;
	    this.columnsCanBeEdited = surveyTemplate.projectCount == 0;

		this.editColumn = function (observableColumnData) {
            wmis.global.showModal({
                viewModel: new EditSurveyTemplateColumnModel(columnTypes, ko.mapper.toJS(observableColumnData)),
                context: this,
                template: 'editSurveyColumnTemplate'
            }).done(function (updatedColumnData) {
                wmis.global.showWaitingScreen("Updating Column...");
                $.ajax({
                    url: '/api/surveytemplate/column',
                    type: 'POST',
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(updatedColumnData)
                }).success(function () {
                    ko.mapper.fromJS(updatedColumnData, "auto", observableColumnData);
                    self.sortColumns();
                }).always(function () {
                    wmis.global.hideWaitingScreen();
                }).fail(function (f) {
                    wmis.global.ajaxErrorHandler(f);
                });
            })
            .fail(function () {
                console.log("Modal cancelled");
            });
		}

	    this.createColumn = function() {
	        wmis.global.showModal({
	            viewModel: new EditSurveyTemplateColumnModel(columnTypes, null),
	            context: this,
	            template: 'editSurveyColumnTemplate'
	        }).done(function (newColumnData) {
	            wmis.global.showWaitingScreen("Creating Column...");
	            $.ajax({
	                url: '/api/surveytemplate/column',
	                type: 'POST',
	                contentType: "application/json",
	                dataType: "json",
	                data: JSON.stringify(newColumnData)
	            }).success(function (surveyTemplateColumnId) {
	                newColumnData.key = surveyTemplateColumnId;
	                self.columns.push(newColumnData);
	                self.sortColumns();
	            }).always(function () {
	                wmis.global.hideWaitingScreen();
	            }).fail(function (f) {
	                wmis.global.ajaxErrorHandler(f);
	            });
	        }).fail(function() {
	            console.log("Modal cancelled");
	        });
	    };

	    this.removeColumn = function(columnData) {
	        wmis.global.showWaitingScreen("Deleting...");
	        $.ajax({
	            url: "/api/surveytemplate/column/" + columnData.key(),
	            type: "DELETE",
	        }).success(function() {
	            self.columns.remove(columnData);
	        }).always(function() {
	            wmis.global.hideWaitingScreen();
	        }).fail(function(f) {
	            wmis.global.ajaxErrorHandler(f);
	        });
	    };

	    this.sortColumns = function() {
	        self.columns.sort(columnSortCompareFunction);
	    };

		this.saveSurveyTemplate = function() {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
		    $.ajax({
		        url: "/api/surveytemplate/",
		        type: "POST",
		        contentType: "application/json",
		        dataType: "json",
		        data: JSON.stringify({
		            surveyTemplateId: self.surveyTemplateId(),
		            name: self.name()
		        })
			}).success(function () {
				window.location.href = "/SurveyTemplate";
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

	    Q.longStackSupport = true; // TODO REMOVE THIS

		var surveyTemplatePromise = Q($.ajax({
		    url: '/api/surveytemplate/' + options.surveyTemplateKey,
		    dataType: 'json',
		    type: "GET"
		}));

		var columnsPromise = Q($.ajax({
		    url: '/api/surveytemplate/columns/' + options.surveyTemplateKey,
		    dataType: 'json',
		    type: "GET"
		}));

	    var columnTypesPromise = Q($.ajax({
	        url: '/api/surveytemplate/columnTypes',
	        dataType: 'json',
	        type: "GET"
	    }));
        
	    Q.all([surveyTemplatePromise, columnsPromise, columnTypesPromise]).spread(function (surveyTemplate, columns, columnTypes) {
	        var viewModel = new SurveyTemplateViewModel(surveyTemplate, columns, columnTypes);
	        ko.applyBindings(viewModel);
	    }, wmis.global.ajaxErrorHandler).done();
	}
	
	return {
		initialize: initialize
	};
}(jQuery));