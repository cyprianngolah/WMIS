wmis.project = wmis.project || {};
wmis.project.editModals = (function ($) {

    function EditAdministratorModel(projectKey) {
        var self = this;

        this.projectKey = projectKey;

        this.currentAdministrators = ko.observableArray();
        this.currentUsers = ko.observableArray();
        this.userOptions = ko.observable();
        this.isUsersLoaded = ko.observable(false);
        this.isAdminsLoaded = ko.observable(false);

        this.isLoadedForEditing = ko.computed(function () {
            return self.isUsersLoaded() && self.isAdminsLoaded();
        });
                
        this.administratorNames = ko.computed(function () {
            var names = ko.utils.arrayMap(self.currentAdministrators(), function (i) {
                return i.name;
            });

            return names.join(", ");
        });

        this.save = function () {
            var waitingScreenId = wmis.global.showWaitingScreen("Saving...");

            var saveDto = {
                key: self.projectKey,
                userIds: ko.utils.arrayMap(self.currentUsers(), function (i) { return i.key })
            };

            $.ajax({
                url: "/api/project/updateUsers",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(saveDto)
            }).success(function (data) {
                self.modal.close();
            }).always(function () {
                wmis.global.hideWaitingScreen(waitingScreenId);
            }).fail(wmis.global.ajaxErrorHandler);
        };

        this.cancel = function () {
            self.modal.close();
        };

        this.loadProjectUsers = function () {
            $.ajax({
                url: "/api/person/projectUsers/" + self.projectKey,
                type: "GET",
                dataType: "json"
            }).success(function (result) {
                self.currentUsers(result.data);

                self.userOptions({
                    valueObservable: self.currentUsers,
                    idProperty: 'key',
                    textFieldNames: ['name'],
                    url: '/api/person/applicationUsers',
                    placeholder: 'Users...'
                });
            }).fail(function (error) {
                wmis.global.ajaxErrorHandler(error);
                failure();
            });
        };

        this.loadProjectAdmins = function () {
            $.ajax({
                url: "/api/person/projectAdmins",
                type: "GET",
                dataType: "json"
            }).success(function (result) {
                self.currentAdministrators(result.data);
                wmis.global.hideWaitingScreen();
            }).fail(function (error) {
                wmis.global.ajaxErrorHandler(error);
                failure();
                wmis.global.hideWaitingScreen();
            });
        }


        wmis.global.showWaitingScreen("Loading...");

        this.loadProjectUsers();
        this.loadProjectAdmins();

    }

    function editAdministrators(projectKey) {
        var viewModel = new EditAdministratorModel(projectKey);

        wmis.global.showModal({
            viewModel: viewModel,
            context: this,
            template: 'editAdministratorTemplate'
        })
        .fail(function () {
            console.log("Modal cancelled");
        });
    }
    /*
    function updateAdministrators(administratorIds, success, failure) {
        wmis.global.showWaitingScreen("Saving...");
        $.ajax({
            url: "/api/project/admin",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                projectId: options.projectKey,
                administratorIds: administratorIds
            })
        }).success(success)
        .always(function () {
            wmis.global.hideWaitingScreen();
        }).fail(function (error) {
            wmis.global.ajaxErrorHandler(error);
            failure();
        });
    }
    */
    return {
        editAdministrators: editAdministrators
    };
}(jQuery));

