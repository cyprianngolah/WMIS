wmis.wolfnecropsy = wmis.wolfnecropsy || {};
wmis.wolfnecropsy.edit = (function ($) {
    var options = {
        wolfnecropsyKey: null,
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
        this.generalcomments = ko.observable(key);


        this.canSave = ko.computed(function () {
            return ($.trim(self.necropsyid()) != "");
        });

        this.getWolfNecropsy = function (Key) {
            var url = "/api/WolfNecropsy/?WolfNecropsyKey=" + Key;
        
            $.getJSON(url, {}, function (json) {
                if (json.data.length > 0) {
                    var d = json.data[Key - 1];
                    console.log(d);
                    self.necropsyid(d.necropsyId);
                    self.commonname (d.commonName);
                    self.speciesid(d.speciesId);
                    self.necropsydate(d.necropsyDate);
                    self.sex(d.sex);
                    self.location(d.location);
                    self.gridcell(d.gridCell);
                    self.datereceived(d.dateReceived);
                    self.datekilled(d.dateKilled);
                    self.ageclass(d.ageClass);
                    self.ageestimated(d.ageEstimated); 
                    self.submitter(d.submitter);
                    self.contactinfo(d.contactInfo);
                    self.regionid(d.regionId);
                    self.methodkilled(d.methodKilled);
                    self.injuries(d.injuries);
                    self.tagcomments(d.tagComments);
                    self.tagrecheck(d.tagReCheck);
                    self.bodywt_unskinned(d.bodyWt_unskinned);
                    self.neckgirth_unsk(d.neckGirth_unsk);
                    self.chestgirth_unsk(d.chestGirth_unsk);
                    self.contour_nose_tail(d.contour_Nose_Tail);
                    self.tail_length(d.tail_Length);
                    self.bodywt_skinned(d.bodyWt_skinned);
                    self.peltwt(d.peltWt);
                    self.neckgirth_sk(d.neckGirth_sk);
                    self.chestgirth_sk(d.chestGirth_sk);
                    self.rumpfat(d.rumpFat);
                    self.totalrank_ext(d.totalRank_Ext);
                    self.tongue(d.tongue);
                    self.haircollected(d.hairCollected);
                    self.skullcollected(d.skullCollected);
                    self.hindlegmuscle_stableisotopes(d.hindlegMuscle_StableIsotopes);
                    self.hindlegmuscle_contaminants(d.hindlegMuscle_Contaminants);
                    self.femur(d.femur);
                    self.feces(d.feces);
                    self.diaphragm(d.diaphragm);
                    self.lung(d.lung);
                    self.liver_dna(d.liver_DNA);
                    self.liver_sia(d.liver_SIA);
                    self.liver_contam(d.liver_Contam);
                    self.spleen(d.spleen);
                    self.kidneyl(d.kidneyL);
                    self.kidneyl_wt(d.kidneyL_wt);
                    self.kidneyr(d.kidneyR);
                    self.kidneyr_wt(d.kidneyR_wt);
                    self.blood_tabs(d.blood_Tabs);
                    self.blood_tubes(d.blood_Tubes);
                    self.stomach(d.stomach);
                    self.stomachcont(d.stomachCont);
                    self.stomach_full(d.stomach_Full);
                    self.stomach_empty(d.stomach_Empty);
                    self.stomachcont_wt(d.stomachCont_wt);
                    self.stomachcontentdesc(d.stomachContentdesc);
                    self.intestinaltract(d.intestinalTract);
                    self.uterinescars(d.uterineScars);
                    self.uterus(d.uterus);
                    self.ovaries(d.ovaries);
                    self.lymphnodes(d.lymphNodes);
                    self.others(d.others);
                    self.internalrank(d.internalRank);
                    self.peltcolor(d.peltColor);
                    self.backfat(d.backFat);
                    self.sternumfat(d.sternumFat);
                    self.inguinalfat(d.inguinalFat);
                    self.incentive(d.incentive);
                    self.incentiveamt(d.incentiveAmt);
                    self.conflict(d.conflict);
                    self.groupsize(d.groupSize);
                    self.packid(d.packId);
                    self.xiphoid(d.xiphoid);
                    self.personnel(d.personnel);
                    self.pictures(d.pictures);
                    self.speciescomments(d.speciesComments);
                    self.taginjurycomments(d.taginjuryComments);
                    self.injurycomments(d.injurycomments);
                    self.examinjurycomments(d.examinjuryComments);
                    self.examcomments(d.examComments);
                    self.picturescomments(d.picturesComments);
                    self.measurementscomments(d.measurementsComments);
                    self.missingpartscomments(d.missingpartsComments);
                    self.stomachcontents(d.stomachContents);
                    self.othersamplescomments(d.otherSamplesComments);
                    self.samplescomments(d.samplesComments); 
                    self.generalcomments(d.generalComments);

                    document.title = "WMIS - WolfNecropsy - " + d.title;
                }
            }).fail(wmis.global.ajaxErrorHandler);
        };

        this.saveWolfNecropsy = function () {
            var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
            $.ajax({
                url: "/api/wolfNecropsy/",
                type: "PUT",
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
        ko.applyBindings(viewModel);
        viewModel.getWolfNecropsy(options.wolfnecropsyKey);
    }

    return {
        initialize: initialize
    };
}(jQuery));