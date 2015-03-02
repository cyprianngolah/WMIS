wmis.user = wmis.user || {};
wmis.user.edit = (function ($) {
	var options = {
		key: null,
	};

	function editViewModel(o) {
		var self = this;

		self.options = o;

		self.user = ko.observable({});

		self.roleOptions = ko.observable();
		self.projectOptions = ko.observable();
		self.isLoadedForEditing = ko.observable(false);

		self.new = function() {
			self.user().key = ko.observable(0);
			self.user().username = ko.observable("");
			self.user().name = ko.observable("");
		};

		self.get = function () {
			var url = "/api/person/" + self.options.key;
			$.getJSON(url, {}, function (json) {
				ko.mapper.fromJS(json, "auto", self.user);
				enableProjectsInput();
				enableRolesInput();
				self.isLoadedForEditing(true);
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.canSave = ko.computed(function () {
		    return "todo";//($.trim(self.name()) != "");
		});  

        self.save = function () {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/person/",
				type: self.isEdit() ? "PUT" : "POST",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(ko.toJS(self.user))
			}).success(function (data) {
			    if (!self.isLoadedForEditing()) {
			        window.location.href = "/user/Edit/" + data;
			    }
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
        };
		
        function enableProjectsInput() {
        	self.projectOptions({
        		valueObservable: self.user().projects,
        		idProperty: 'key',
        		textFieldNames: ['name'],
        		url: '/api/project',
        		placeholder: 'Projects...'
        	});
        }

        function enableRolesInput() {
        	self.roleOptions({
        		valueObservable: self.user().roles,
        		idProperty: 'key',
        		textFieldNames: ['name'],
        		url: '/api/person/userRoles',
        		placeholder: 'Roles...'
        	});
        }


		self.isEdit = function() {
			return self.options.key > 0;
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editViewModel(options);
		if (viewModel.isEdit()) {
			viewModel.get();
		} else {
			viewModel.new();
		}
		ko.applyBindings(viewModel);
	}
	
	return {
		initialize: initialize
	};
}(jQuery));