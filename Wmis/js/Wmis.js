/// <summary>
/// Create a root namespace to which modules can be added.
/// </summary>
var wmis = {};

wmis.global = (function ($) {
	function showWaitingScreen(message) {
		$('#waitingModal .modal-body').text(message);
		$('#waitingModal').modal("show");
	}
	
	function hideWaitingScreen() {
		$('#waitingModal').modal("hide");
	}

	// Loads a select box with data via an AJAX get call and then initializes it as a 
	// single select select2
	// Note - This may be replaced by more knockout oriented logic
	function loadAndInitializeSelect2($select, ajaxUrl, placeHolder, showAll, dataPropertyName) {
		$.ajax({
			url: ajaxUrl,
			dataType: "json",
			type: "GET",
			xhrFields: {
				withCredentials: true
			}
		}).done(function(data) {
			appendDataToSelect(data, $select, showAll, dataPropertyName);
		}).fail(wmis.global.ajaxErrorHandler);

		$select.select2({
			placeholder: placeHolder
		});
	}

	// Shortcut for appending data to a select
	// Expects data to have a key and a value property
	function appendDataToSelect (data, $select, showAll, dataPropertyName) {
		$select.empty();
		if(typeof(showAll) == 'undefined' || showAll)
			$select.append("<option value=''>All</option>");
		var dataCollection = typeof(dataPropertyName) == 'undefined' ? data : data[dataPropertyName];
		$.each(dataCollection, function (index, value) {
			$select.append($("<option></option>").attr("value", value.key).text(value.name));
		});
	};

	// Global Error Handler
	// Current implementation is a temproary placeholder until a more robust dialog can be built
	function ajaxErrorHandler(jqXhr, textStatus, errorThrown) {
		alert("There was an error during the request.\n" + errorThrown +": " + jqXhr.responseText);
	};

	function getDropDownData(observableArray, url, parsingFunction) {
		var promise = $.getJSON(url, {}, function (json) {
			if (parsingFunction) {
				observableArray(parsingFunction(json));
			} else {
				observableArray(json);
			}
		}).fail(wmis.global.ajaxErrorHandler);

		return promise;
	};

    function dirtyFlagFor(ko, observable) {
        // Toggle is used to force reevaluation of the computed observable. 
        var toggle = ko.observable(Math.random());

        var _isDirty = false;

        return {
            isDirty: ko.computed(function() {
                if (!_isDirty) {
                    //just for subscriptions
                    ko.toJS(observable);

                    //next time return true and avoid ko.toJS
                    _isDirty = true;

                    //on initialization this flag is not dirty
                    return false;
                } else {
                    // Watch the toggle
                    toggle();
                    return true;
                }
            }),
            reset: function() {
                _isDirty = false;
                toggle(Math.random());
            }
        }
    }

    function showModal (options) {

        var createModalElement = function (templateName, viewModel) {
            var temporaryDiv = addHiddenDivToBody();
            var deferredElement = $.Deferred();
            ko.renderTemplate(
                templateName,
                viewModel,
                // We need to know when the template has been rendered,
                // so we can get the resulting DOM element.
                // The resolve function receives the element.
                {
                    afterRender: function (nodes) {
                        // Ignore any #text nodes before and after the modal element.
                        var elements = nodes.filter(function (node) {
                            return node.nodeType === 1; // Element
                        });
                        deferredElement.resolve(elements[0]);
                    }
                },
                // The temporary div will get replaced by the rendered template output.
                temporaryDiv,
                "replaceNode"
            );
            // Return the deferred DOM element so callers can wait until it's ready for use.
            return deferredElement;
        };

        var addHiddenDivToBody = function () {
            var div = document.createElement("div");
            div.style.display = "none";
            document.body.appendChild(div);
            return div;
        };

        var addModalHelperToViewModel = function (viewModel, deferredModalResult, modalContext) {
            // Provide a way for the viewModel to close the modal and pass back a result.
            viewModel.modal = {
                close: function (result) {
                    if (typeof result !== "undefined") {
                        deferredModalResult.resolveWith(modalContext, [result]);
                    } else {
                        // When result is undefined, we don't want any `done` callbacks of
                        // the deferred being called. So reject instead of resolve.
                        deferredModalResult.rejectWith(modalContext, []);
                    }
                }
            };
        };

        var showTwitterBootstrapModal = function ($ui) {
            // Display the modal UI using Twitter Bootstrap's modal plug-in.
            $ui.modal({
                // Clicking the backdrop, or pressing Escape, shouldn't automatically close the modal by default.
                // The view model should remain in control of when to close.
                backdrop: "static",
                keyboard: false
            });
        };

        var whenModalResultCompleteThenHideUI = function (deferredModalResult, $ui) {
            // When modal is closed (with or without a result)
            // Then always hide the UI.
            deferredModalResult.always(function () {
                $ui.modal("hide");
            });
        };

        var whenUIHiddenThenRemoveUI = function ($ui) {
            // Hiding the modal can result in an animation.
            // The `hidden` event is raised after the animation finishes,
            // so this is the right time to remove the UI element.
            $ui.on("hidden", function () {
                // Call ko.cleanNode before removal to prevent memory leaks.
                $ui.each(function (index, element) { ko.cleanNode(element); });
                $ui.remove();
            });
        };

        if (typeof options === "undefined") throw new Error("An options argument is required.");
        if (typeof options.viewModel !== "object") throw new Error("options.viewModel is required.");

        var viewModel = options.viewModel;
        var template = options.template || viewModel.template;
        var context = options.context;

        if (!template) throw new Error("options.template or options.viewModel.template is required.");

        return createModalElement(template, viewModel)
            .pipe($) // jQueryify the DOM element
            .pipe(function ($ui) {
                var deferredModalResult = $.Deferred();
                addModalHelperToViewModel(viewModel, deferredModalResult, context);
                showTwitterBootstrapModal($ui);
                whenModalResultCompleteThenHideUI(deferredModalResult, $ui);
                whenUIHiddenThenRemoveUI($ui);
                return deferredModalResult;
            });
    };


	return {
		appendDataToSelect: appendDataToSelect,
		ajaxErrorHandler: ajaxErrorHandler,
		loadAndInitializeSelect2: loadAndInitializeSelect2,
		showWaitingScreen: showWaitingScreen,
		hideWaitingScreen: hideWaitingScreen,
		getDropDownData: getDropDownData,
		dirtyFlagFor: dirtyFlagFor,
		showModal: showModal
	};
}(jQuery));

wmis.global.waitingDialog = (function ($) {
	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			var settings = $.extend({
				dialogSize: 'm',
				progressType: ''
			}, options);
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			if (typeof options === 'undefined') {
				options = {};
			}
			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	}

})(jQuery);
