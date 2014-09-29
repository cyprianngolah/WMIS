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
        update: function (element) {
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

    ko.bindingHandlers.datePicker = {
    	init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
    		// Options
    		var options = {
    			todayHighlight: true,
    			autoclose: true,
    			format: 'mm/dd/yyyy',
    			todayBtn: "linked",
    			forceParse: true
    		};
    		if (allBindingsAccessor().datePickerOptions) {
    			options = $.extend(options, allBindingsAccessor().datePickerOptions);
    		}
    		$(element).datepicker(options);

    		// Set Initial value
    		var value = valueAccessor();
    		var valueUnwrapped = ko.utils.unwrapObservable(value);
    		var date = moment.utc(valueUnwrapped, moment.ISO_8601).local().format('L');
    		$(element).datepicker('update', date);

			// Handle Change events
    		$(element).on("changeDate", function (ev) {
    			var date = moment(ev.date);
			    valueAccessor()(date.toDate());
		    });

    		//handle removing an element from the dom
    		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
    			$(element).datepicker('remove');
    		});
    	},
    	update: function (element, valueAccessor) {
    		var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
    		var date = moment.utc(valueUnwrapped).local().format('L');
    		$(element).datepicker('update', date);
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
