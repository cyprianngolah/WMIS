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
	function loadAndInitializeSelect2($select, ajaxUrl, placeHolder, showAll) {
		$.ajax({
			url: ajaxUrl,
			dataType: "json",
			type: "GET",
			xhrFields: {
				withCredentials: true
			}
		}).done(function(data) {
			appendDataToSelect(data, $select, showAll);
		}).fail(wmis.global.ajaxErrorHandler);

		//$select.select2({
		//	placeholder: placeHolder
		//});
	}

	// Shortcut for appending data to a select
	// Expects data to have a key and a value property
	function appendDataToSelect (data, $select, showAll) {
		$select.empty();
		if(typeof(showAll) == 'undefined' || showAll)
			$select.append("<option value=''>All</option>");
		$.each(data, function (index, value) {
			$select.append($("<option></option>").attr("value", value.key).text(value.name));
		});
	};

	// Global Error Handler
	// Current implementation is a temproary placeholder until a more robust dialog can be built
	function ajaxErrorHandler(jqXhr, textStatus, errorThrown) {
		alert("There was an error during the request.\n" + errorThrown +": " + jqXhr.responseText);
	};

	return {
		appendDataToSelect: appendDataToSelect,
		ajaxErrorHandler: ajaxErrorHandler,
		loadAndInitializeSelect2: loadAndInitializeSelect2,
		showWaitingScreen: showWaitingScreen,
		hideWaitingScreen: hideWaitingScreen
	};
}(jQuery));