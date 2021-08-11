class wmis {


    /**
     * Transform data for select2 dropdown box
     * @param {any} options
     * @param {any} valueField
     * @param {any} labelField
     */
    transformForSelect2(options, valueField = 'key', labelField = 'name') {
        for (const o of options) {
            o.id = o[valueField]
            o.text = o[labelField]
        }
        return options;
    }
}
