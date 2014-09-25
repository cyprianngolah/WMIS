/// <summary>
/// Knockout infrastructure that will get reused
/// </summary>
$(function () {

    // Define a global select2 binding handler to simplify creation of select2 controls in templates
    ko.bindingHandlers.select2 = {
        init: function (element, valueAccessor) {
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).select2('destroy');
            });

            var options = ko.toJS(valueAccessor()) || {};
            setTimeout(function () {
                $(element).select2(options);
            }, 0);
        },
        update: function(element) {
            $(element).trigger('change');
        }
    };

    ko.bindingHandlers.select2Tags = {
        init: function (element, valueAccessor) {
            var elementDom = $(element);
            var value = valueAccessor();

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                elementDom.select2('destroy');
            });

            var options = ko.toJS(value) || {};
            elementDom.select2(options);

            elementDom.on("change", function () {
                var newVal = elementDom.val().split(",");
                value.val(newVal);
            });
        },
        update: function (element, valueAccessor) {
            $(element).select2("val", valueAccessor().val());
        }
    };

    ko.extenders.async = function (computedDeferred, initialValue) {

        var plainObservable = ko.observable(initialValue), currentDeferred;
        plainObservable.inProgress = ko.observable(false);

        ko.computed(function () {
            if (currentDeferred) {
                currentDeferred.reject();
                currentDeferred = null;
            }

            var newDeferred = computedDeferred();
            if (newDeferred &&
                (typeof newDeferred.done == "function")) {

                // It's a deferred
                plainObservable.inProgress(true);

                // Create our own wrapper so we can reject
                currentDeferred = $.Deferred().done(function (data) {
                    plainObservable.inProgress(false);
                    plainObservable(data);
                });
                newDeferred.done(currentDeferred.resolve);
            } else {
                // A real value, so just publish it immediately
                plainObservable(newDeferred);
            }
        });

        return plainObservable;
    };

});
