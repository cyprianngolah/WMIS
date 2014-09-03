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

});
