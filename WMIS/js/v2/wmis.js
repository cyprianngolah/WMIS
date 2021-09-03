class WMIS {
	static showWaitingScreen(message) {
		$('#waitingModal .modal-body').text(message);
		$('#waitingModal').modal("show");
	}

	static hideWaitingScreen() {
		$('#waitingModal').modal("hide");
	}


	/**
     * Transform data for select2 dropdown box
     * @param {any} options
     * @param {any} valueField
     * @param {any} labelField
     */
    static transformForSelect2(options, valueField = 'key', labelField = 'name') {
		for (const o of options) {
			o.id = o[valueField]
			o.text = o[labelField],
			o.label=o[labelField]
		}
		return options;
	}

	// get key for edit pages from Viewbag
	static getKey(selector) {
		return parseInt($(selector).val());
	}


	static createModal(selector) {
		return new bootstrap.Modal(document.getElementById(selector), {
			keyboard: false,
			backdrop: 'static'
		});
    }

	// Loads a select box with data via an AJAX get call and then initializes it as a 
	// single select select2
	// Note - This may be replaced by more knockout oriented logic
	static loadAndInitializeSelect2($select, ajaxUrl, placeHolder, showAll, showAllText = "All", dataPropertyName) {
		const _this = this;
		$.ajax({
			url: ajaxUrl,
			dataType: "json",
			type: "GET",
			xhrFields: {
				withCredentials: true
			}
		}).done(function (data) {
			_this.appendDataToSelect(data, $select, showAll, showAllText, dataPropertyName);
		}).fail((error) => console.log("error"));

		$select.select2({
			theme: "bootstrap-5",
			placeholder: placeHolder,
			selectionCssClass: "select2--medium", // For Select2 v4.1
			dropdownCssClass: "select2--small",
		});
	}


	// Shortcut for appending data to a select
	// Expects data to have a key and a value property
	static appendDataToSelect(data, $select, showAll, showAllText = "All", dataPropertyName) {
		$select.empty();
		if (typeof (showAll) == 'undefined' || showAll)
			$select.append("<option value='all'>" + showAllText +"</option>");
		var dataCollection = typeof (dataPropertyName) == 'undefined' ? data : data[dataPropertyName];
		$.each(dataCollection, function (index, value) {
			$select.append($("<option></option>").attr("value", value.key).text(value.name));
		});
	};

}
