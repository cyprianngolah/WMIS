wmis.WolfNecropsy = wmis.WolfNecropsy || {};
wmis.WolfNecropsy.edit = (function ($) {
    var options = {
        WolfNecropsyKey: null,
    };

    function editWolfNecropsyViewModel(key) {
        var self = this;
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
        this.generalComments = ko.observable(key);


        this.canSave = ko.computed(function () {
            return ($.trim(self.code()) != "");
        });

        this.getWolfNecropsy = function () {
            var url = "/api/WolfNecropsy/?WolfNecropsyKey=" + self.key();
            $.getJSON(url, {}, function (json) {
                if (json.data.length > 0) {
                    var d = json.data[0];
                    self.necropsyid(d.necropsyid);
                    self.commonname(d.commonname);
                    self.speciesid(d.speciesid);
                    self.necropsydate(d.necropsydate);
                    self.sex(d.sex);
                    self.location(d.location);
                    self.gridcell(d.gridcell);
                    self.datereceived(d.datereceived);
                    self.datekilled(d.datekilled);
                    self.ageclass(d.ageclass);
                    self.ageestimated(d.ageestimated);
                    self.submitter(d.submitter);
                    self.contactinfo(d.contactinfo);
                    self.regionid(d.regionid);
                    self.methodkilled(d.methodkilled);
                    self.injuries(d.injuries);
                    self.tagcomments(d.tagcomments);
                    self.tagrecheck(d.tagrecheck);
                    self.bodywt_unskinned(d.bodywt_unskinned);
                    self.neckgirth_unsk(d.neckgirth_unsk);
                    self.chestgirth_unsk(d.chestgirth_unsk);
                    self.contour_nose_tail(d.contour_nose_tail);
                    self.tail_length(d.tail_length);
                    self.bodywt_skinned(d.bodywt_skinned);
                    self.peltwt(d.peltwt);
                    self.neckgirth_sk(d.neckgirth_sk);
                    self.chestgirth_sk(d.chestgirth_sk);
                    self.rumpfat(d.rumpfat);
                    self.totalrank_ext(d.totalrank_ext);
                    self.tongue(d.tongue);
                    self.haircollected(d.haircollected);
                    self.skullcollected(d.skullcollected);
                    self.hindlegmuscle_stableisotopes(d.hindlegmuscle_stableisotopes);
                    self.hindlegmuscle_contaminants(d.hindlegmuscle_contaminants);
                    self.femur(d.femur);
                    self.feces(d.feces);
                    self.diaphragm(d.diaphragm);
                    self.lung(d.lung);
                    self.liver_dna(d.liver_dna);
                    self.liver_sia(d.liver_sia);
                    self.liver_contam(d.liver_contam);
                    self.spleen(d.spleen);
                    self.kidneyl(d.kidneyl);
                    self.kidneyl_wt(d.kidneyl_wt);
                    self.kidneyr(d.kidneyr);
                    self.kidneyr_wt(d.kidneyr_wt);
                    self.blood_tabs(d.blood_tabs);
                    self.blood_tubes(d.blood_tubes);
                    self.stomach(d.stomach);
                    self.stomachcont(d.stomachcont);
                    self.stomach_full(d.stomach_full);
                    self.stomach_empty(d.stomach_empty);
                    self.stomachcont_wt(d.stomachcont_wt);
                    self.stomachcontentdesc(d.stomachcontentdesc);
                    self.intestinaltract(d.intestinaltract);
                    self.uterinescars(d.uterinescars);
                    self.uterus(d.uterus);
                    self.ovaries(d.ovaries);
                    self.lymphnodes(d.lymphnodes);
                    self.others(d.others);
                    self.internalrank(d.internalrank);
                    self.peltcolor(d.peltcolor);
                    self.backfat(d.backfat);
                    self.sternumfat(d.sternumfat);
                    self.inguinalfat(d.inguinalfat);
                    self.incentive(d.incentive);
                    self.incentiveamt(d.incentiveamt);
                    self.conflict(d.conflict);
                    self.groupsize(d.groupsize);
                    self.packid(d.packid);
                    self.xiphoid(d.xiphoid);
                    self.personnel(d.personnel);
                    self.pictures(d.pictures);
                    self.speciescomments(d.speciescomments);
                    self.taginjurycomments(d.taginjurycomments);
                    self.injurycomments(d.injurycomments);
                    self.examinjurycomments(d.examinjurycomments);
                    self.examcomments(d.examcomments);
                    self.picturescomments(d.picturescomments);
                    self.measurementscomments(d.measurementscomments);
                    self.missingpartscomments(d.missingpartscomments);
                    self.stomachcontents(d.stomachcontents);
                    self.othersamplescomments(d.othersamplescomments);
                    self.samplescomments(d.samplescomments);
                    self.generalComments(d.generalComments);


                    document.title = "WMIS - WolfNecropsy - " + d.title;
                }
            }).fail(wmis.global.ajaxErrorHandler);
        };

        this.saveWolfNecropsy = function () {
            var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
            $.ajax({
                url: "/api/WolfNecropsy/",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(ko.toJS(self))
            }).success(function () {
                window.location.href = "/WolfNecropsy/";
            }).always(function () {
                wmis.global.hideWaitingScreen(waitingScreenId);
            }).fail(wmis.global.ajaxErrorHandler);
        };
    }

    function initialize(initOptions) {
        $.extend(options, initOptions);

        var viewModel = new editWolfNecropsyViewModel(options.WolfNecropsyKey);
        ko.applyBindings(viewModel);

        if (viewModel.key() > 0) {
            viewModel.getWolfNecropsy();
        }
    }

    return {
        initialize: initialize
    };
}(jQuery));