wmis.argosservice = wmis.argosservice || {};
wmis.argosservice.index = (function ($) {
	var options = {

	};

	function argosAdminServiceViewModel() {
		var self = this;
		self.scheduleCron = ko.observable("");

		self.getScheduleCron = function () {
			$.ajax({
				url: "/api/argos/schedule/",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).success(function (data) {
				if (data == "") {
					self.scheduleCron("unscheduled");
				} else {
					self.scheduleCron(data);
				}
			}).always(function () {
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.updateSchedule = function() {
			var waitingScreenId = wmis.global.showWaitingScreen("Updating Schedule...");
			$.ajax({
				url: "/api/argos/schedule/",
				type: "POST",
				contentType: "application/json",
				dataType: "json"
			}).success(function () {
				alert("Schedule Updated.");
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
		
		self.getCollarData = function () {
			var waitingScreenId = wmis.global.showWaitingScreen("Scheduling Jobs...");
			$.ajax({
				url: "/api/argos/queueJobs/",
				type: "POST",
				contentType: "application/json",
				dataType: "json"
			}).success(function () {
				alert("Jobs Scheduled.");
			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};

		self.getAccessCollarFolder = function () {
		    //var waitingScreenId = wmis.global.showWaitingScreen("Accessing Folder...");
		    $.ajax({
		        url: "/api/argos/accessCollarsFolder/",
		        type: "POST",
		        contentType: "application/json",
		        dataType: "json"
		    }).success(function (data) {
		        alert("Job Completed: " + data);
		    }).always(function () {
		        //wmis.global.hideWaitingScreen(waitingScreenId);
		    }).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);
		
		var viewModel = new argosAdminServiceViewModel();
		ko.applyBindings(viewModel);

		viewModel.getScheduleCron();
	}

	return {
		initialize: initialize
	};
}(jQuery));