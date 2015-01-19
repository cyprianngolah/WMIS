/// <summary>
/// Knockout infrastructure that will get reused
/// </summary>
$(function() {

    // Define a global select2 binding handler to simplify creation of select2 controls in templates
    ko.bindingHandlers.select2 = {
        init: function(element, valueAccessor) {
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).select2('destroy');
            });

            var options = ko.toJS(valueAccessor()) || {};
            setTimeout(function() {
                $(element).select2(options);
            }, 0);
        },
        update: function(element, valueAccessor) {
            /*
            Select2 doesn't need us to pass it the key, 
            but by accessing the key's value we ensure that this update function is fired 
            */
            var value = ko.unwrap(valueAccessor());
            value.key && value.key();
            $(element).trigger('change');
        }
    };

    ko.bindingHandlers.select2KeyValueTags = (function () {
        function getInitialValueKeys(valueObservable, idProperty) {
            return _.pluck(valueObservable(), idProperty);
        }

        function createInitSelectionFunction(valueObservable, recordMapper) {
           return function (element, callback) {
               var initialValueObjects = _.map(valueObservable(), recordMapper);
                callback(initialValueObjects);
            }
        }

        function createRecordMapper(idProperty, textFieldNames) {
            return function (record) {
                var recordData = ko.toJS(record);
                var textValues = _.map(textFieldNames, function (propertyName) {
                    return recordData[propertyName];
                });
                var text = _.compact(textValues).join(' - ');
                return {
                    id: recordData[idProperty],
                    text: text,
                    record: recordData
                };
            };
        }

        function createSelect2Options(url, placeholder, recordMapper, initSelectionFunction) {
            return {
                minimumInputLength: 1,
                multiple: true,
                initSelection: initSelectionFunction,
                ajax: {
                    url: url,
                    placeholder: placeholder,
                    dataType: "json",
                    data: function(term, page) {
                        return {
                            searchString: term,
                            startRow: (page - 1) * 25,
                            rowCount: 25
                        };
                    },
                    results: function(result, page, query) {
                        var processedResults = _.map(result.data, recordMapper);
                        return { results: processedResults };
                    }
                }
            };
        }

        return {
            init: function (element, valueAccessor, allBindings) {
                // Pull the options out of the value binding
                var $element = $(element);
                var options = ko.unwrap(valueAccessor());
                var valueObservable = options.valueObservable;
                var idProperty = options.idProperty;
                var textFieldNames = options.textFieldNames;
                var url = options.url;
                var placeholder = options.placeholder;

                // Configure the dropdown
                var recordMapper = createRecordMapper(idProperty, textFieldNames);
                var initSelectionFunction = createInitSelectionFunction(valueObservable, recordMapper);
                var select2Options = createSelect2Options(url, placeholder, recordMapper, initSelectionFunction);
                $element.select2(select2Options);

                // Initialize the dropdown
                var initialValueKeys = getInitialValueKeys(valueObservable, idProperty);
                $element.select2('val', initialValueKeys);

                // Set up the dropdown change handler to update the observable
                $element.on("change", function() {
                    var data = $element.select2('data'); // IMPORTANT
                    var originalRecordFormat = _.pluck(data, 'record');
                    valueObservable(originalRecordFormat);
                });
                
                // Handle disposal
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.select2('destroy');
                });
            }
        }
    })();

    ko.bindingHandlers.select2Tags = {
        init: function (element, valueAccessor) {
            var elementDom = $(element);
            var value = valueAccessor();

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                elementDom.select2('destroy');
            });

            var options = ko.toJS(value) || {};
            options.dropdownCssClass = 'hideSearch';
            options.selectOnBlur = true;
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
    		if (valueUnwrapped != null) {
    			var date = moment.utc(valueUnwrapped, moment.ISO_8601).format('L');
    			$(element).datepicker('update', date);
    		}

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
    		if (valueUnwrapped != null) {
    			var date = moment.utc(valueUnwrapped).format('L');
    			$(element).datepicker('update', date);
    		}
    	}
    };

    ko.bindingHandlers.booleanValueSelect = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            $(element).append('<option value="true">Yes</option><option value="false">No</option><option value="unknown">Unknown</option>');
            var observable = valueAccessor(),
                interceptor = ko.computed({
                    read: function () {
                        if (observable() == null) {
                            return "unknown";
                        } else {
                            return observable().toString();
                        }
                    },
                    write: function (newValue) {
                        if (newValue == "unknown") {
                            observable(null);
                        } else {
                            observable(newValue === "true");
                        }
                    }
                });

            ko.applyBindingsToNode(element, { value: interceptor });
        }
    };

    ko.bindingHandlers.dateText = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var allBindings = allBindingsAccessor();
            var valueUnwrapped = ko.utils.unwrapObservable(value);

            var pattern = allBindings.format || 'LL';

            var output = "";
            if (valueUnwrapped !== null && valueUnwrapped !== undefined && valueUnwrapped.length > 0) {
                output = moment(valueUnwrapped).format(pattern);
            }

            if ($(element).is("input") === true) {
                $(element).val(output);
            } else {
                $(element).text(output);
            }
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


    ko.bindingHandlers.showModal = {
    	init: function (element, valueAccessor) {
    	},
    	update: function (element, valueAccessor) {
    		var value = valueAccessor();
    		if (ko.utils.unwrapObservable(value)) {
    			$(element).modal('show');
    			// this is to focus input field inside dialog
    			$("input", element).focus();
    		}
    		else {
    			$(element).modal('hide');
    		}
    	}
    };
});
