wmis.user = wmis.user || {};
wmis.user.edit = (function ($) {
	var options = {
		key: null,
	};

	function editViewModel(key) {
		var self = this;
		this.key = ko.observable(key);
		this.username = ko.observable("");
		this.name = ko.observable("");
		this.lastName = ko.observable("");
		this.hasAdministratorProjectRole = ko.observable(false);
		this.hasAdministratorBiodiversityRole = ko.observable(false);
	    this.projects = ko.observableArray();
	    this.projectOptions = ko.observable();
	    this.roleOptions = ko.observable();
	    this.isLoadedForEditing = ko.observable(false);

		this.canSave = ko.computed(function() {
		    return "todo";//($.trim(self.name()) != "");
		});

        function enableProjectsInput() {
            self.projectOptions({
                valueObservable: self.projects,
                idProperty: 'key',
                textFieldNames: ['name'],
                url: '/api/project',
                placeholder: 'Projects...'
            });
        }

		this.get = function () {
			var url = "/api/person/" + self.key();
		    $.getJSON(url, {}, function (json) {
		        ko.mapper.fromJS(json, "auto", self);
		        enableProjectsInput();
		        self.isLoadedForEditing(true);
		    }).fail(wmis.global.ajaxErrorHandler);
		};

		this.save = function() {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/person/",
				type: self.isEdit() ? "PUT" : "POST",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self))
			}).success(function () {
			    if (self.isLoadedForEditing()) {
			        window.location.href = "/user/Edit/" + self.key();
			    } else {
			        self.key(key);
			        self.isLoadedForEditing(true);
			        enableProjectsInput();
			    }
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};

		this.isEdit = function () { return self.key() > 0; }
        
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editViewModel(options.key);
		ko.applyBindings(viewModel);

		if (viewModel.isEdit()) {
			viewModel.get();
		}
	}
	
	return {
		initialize: initialize
	};
}(jQuery));