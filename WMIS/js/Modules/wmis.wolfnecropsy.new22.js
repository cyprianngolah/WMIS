wmis.wolfnecropsy = wmis.wolfnecropsy || {};
wmis.wolfnecropsy.new = (function ($) {
    var options = {
        wolfnecropsyKey: null,
    };

    function editWolfNecropsyViewModel(key) {
        var self = this;
        options.wolfnecropsyKey = key;
        this.key = ko.observable(key);
        this.necropsyid = ko.observable(key);
        this.commonname = ko.observable(key);
        this.speciesid = ko.observable(key);
        this.necropsydate = ko.observable(key);
        this.sex = ko.observable(key);
        this.location = ko.observable(key);
        this.gridcell = ko.observable(key);
        this.datereceived = ko.observable(key);
        this.datekilled = ko.observable(key);
        this.ageclass = ko.observable(key);
        this.ageestimated = ko.observable(key);
        this.submitter = ko.observable(key);
        this.contactinfo = ko.observable(key);
        this.regionid = ko.observable(key);
        this.methodkilled = ko.observable(key);
        this.injuries = ko.observable(key);
        this.tagcomments = ko.observable(key);
        this.tagrecheck = ko.observable(key);
        this.bodywt_unskinned = ko.observable(key);
        this.neckgirth_unsk = ko.observable(key);
        this.chestgirth_unsk = ko.observable(key);
        this.contour_nose_tail = ko.observable(key);
        this.tail_length = ko.observable(key);
        this.bodywt_skinned = ko.observable(key);
        this.peltwt = ko.observable(key);
        this.neckgirth_sk = ko.observable(key);
        this.chestgirth_sk = ko.observable(key);
        this.rumpfat = ko.observable(key);
        this.totalrank_ext = ko.observable(key);
        this.tongue = ko.observable(key);
        this.haircollected = ko.observable(key);
        this.skullcollected = ko.observable(key);
        this.hindlegmuscle_stableisotopes = ko.observable(key);
        this.hindlegmuscle_contaminants = ko.observable(key);
        this.femur = ko.observable(key);
        this.feces = ko.observable(key);
        this.diaphragm = ko.observable(key);
        this.lung = ko.observable(key);
        this.liver_dna = ko.observable(key);
        this.liver_sia = ko.observable(key);
        this.liver_contam = ko.observable(key);
        this.spleen = ko.observable(key);
        this.kidneyl = ko.observable(key);
        this.kidneyl_wt = ko.observable(key);
        this.kidneyr = ko.observable(key);
        this.kidneyr_wt = ko.observable(key);
        this.blood_tabs = ko.observable(key);
        this.blood_tubes = ko.observable(key);
        this.stomach = ko.observable(key);
        this.stomachcont = ko.observable(key);
        this.stomach_full = ko.observable(key);
        this.stomach_empty = ko.observable(key);
        this.stomachcont_wt = ko.observable(key);
        this.stomachcontentdesc = ko.observable(key);
        this.intestinaltract = ko.observable(key);
        this.uterinescars = ko.observable(key);
        this.uterus = ko.observable(key);
        this.ovaries = ko.observable(key);
        this.lymphnodes = ko.observable(key);
        this.others = ko.observable(key);
        this.internalrank = ko.observable(key);
        this.peltcolor = ko.observable(key);
        this.backfat = ko.observable(key);
        this.sternumfat = ko.observable(key);
        this.inguinalfat = ko.observable(key);
        this.incentive = ko.observable(key);
        this.incentiveamt = ko.observable(key);
        this.conflict = ko.observable(key);
        this.groupsize = ko.observable(key);
        this.packid = ko.observable(key);
        this.xiphoid = ko.observable(key);
        this.personnel = ko.observable(key);
        this.pictures = ko.observable(key);
        this.speciescomments = ko.observable(key);
        this.taginjurycomments = ko.observable(key);
        this.injurycomments = ko.observable(key);
        this.examinjurycomments = ko.observable(key);
        this.examcomments = ko.observable(key);
        this.picturescomments = ko.observable(key);
        this.measurementscomments = ko.observable(key);
        this.missingpartscomments = ko.observable(key);
        this.stomachcontents = ko.observable(key);
        this.othersamplescomments = ko.observable(key);
        this.samplescomments = ko.observable(key);
        this.generalcomments = ko.observable(key);


        this.canSave = ko.computed(function () {
            return ($.trim(self.necropsyid()) != "");
        });
 
        this.saveWolfNecropsy = function () {
            var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
            $.ajax({
                url: "/api/wolfNecropsy/",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(ko.toJS(self))
            }).success(function () {
                window.location.href = "/wolfNecropsy/";
            }).always(function () {
                wmis.global.hideWaitingScreen(waitingScreenId);
            }).fail(wmis.global.ajaxErrorHandler);
        };
    }

    function initialize(initOptions) {
        $.extend(options, initOptions);

        var viewModel = new editWolfNecropsyViewModel(options.wolfnecropsyKey);
        alert(options.wolfnecropsyKey);
        ko.applyBindings(viewModel);
    }

    return {
        initialize: initialize
    };
}(jQuery));