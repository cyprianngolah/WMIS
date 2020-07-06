wmis.wolfnecropsy = wmis.wolfnecropsy || {};
wmis.wolfnecropsy.new = (function($) {
    var options = {

    };

    function editWolfNecropsyViewModel() {
        var self = this;
        this.wn = new ko.observable({
			necropsyid: ko.observable(""),
			commonname: ko.observable(""),
			speciesid: ko.observable(""),
			necropsydate: ko.observable(""),
			sex: ko.observable(""),
			location: ko.observable(""),
			gridcell: ko.observable(""),
			datereceived: ko.observable(""),
			datekilled: ko.observable(""),
			ageclass: ko.observable(""),
			ageestimated: ko.observable(""),
			submitter: ko.observable(""),
			contactinfo: ko.observable(""),
			regionid: ko.observable(""),
			methodkilled: ko.observable(""),
			injuries: ko.observable(""),
			tagcomments: ko.observable(""),
			tagrecheck: ko.observable(""),
			bodywt_unskinned: ko.observable(""),
			neckgirth_unsk: ko.observable(""),
			chestgirth_unsk: ko.observable(""),
			contour_nose_tail: ko.observable(""),
			tail_length: ko.observable(""),
			bodywt_skinned: ko.observable(""),
			peltwt: ko.observable(""),
			neckgirth_sk: ko.observable(""),
			chestgirth_sk: ko.observable(""),
			rumpfat: ko.observable(""),
			totalrank_ext: ko.observable(""),
			tongue: ko.observable(""),
			haircollected: ko.observable(""),
			skullcollected: ko.observable(""),
			hindlegmuscle_stableisotopes: ko.observable(""),
			hindlegmuscle_contaminants: ko.observable(""),
			femur: ko.observable(""),
			feces: ko.observable(""),
			diaphragm: ko.observable(""),
			lung: ko.observable(""),
			liver_dna: ko.observable(""),
			liver_sia: ko.observable(""),
			liver_contam: ko.observable(""),
			spleen: ko.observable(""),
			kidneyl: ko.observable(""),
			kidneyl_wt: ko.observable(""),
			kidneyr: ko.observable(""),
			kidneyr_wt: ko.observable(""),
			blood_tabs: ko.observable(""),
			blood_tubes: ko.observable(""),
			stomach: ko.observable(""),
			stomachcont: ko.observable(""),
			stomach_full: ko.observable(""),
			stomach_empty: ko.observable(""),
			stomachcont_wt: ko.observable(""),
			stomachcontentdesc: ko.observable(""),
			intestinaltract: ko.observable(""),
			uterinescars: ko.observable(""),
			uterus: ko.observable(""),
			ovaries: ko.observable(""),
			lymphnodes: ko.observable(""),
			others: ko.observable(""),
			internalrank: ko.observable(""),
			peltcolor: ko.observable(""),
			backfat: ko.observable(""),
			sternumfat: ko.observable(""),
			inguinalfat: ko.observable(""),
			incentive: ko.observable(""),
			incentiveamt: ko.observable(""),
			conflict: ko.observable(""),
			groupsize: ko.observable(""),
			packid: ko.observable(""),
			xiphoid: ko.observable(""),
			personnel: ko.observable(""),
			pictures: ko.observable(""),
			speciescomments: ko.observable(""),
			taginjurycomments: ko.observable(""),
			injurycomments: ko.observable(""),
			examinjurycomments: ko.observable(""),
			examcomments: ko.observable(""),
			picturescomments: ko.observable(""),
			measurementscomments: ko.observable(""),
			missingpartscomments: ko.observable(""),
			stomachcontents: ko.observable(""),
			othersamplescomments: ko.observable(""),
			samplescomments: ko.observable(""),
			generalcomments: ko.observable("")
        });
        this.saveEnabled = ko.computed(function () {
            var wn = self.wn();
	        var fields = [
				wn.necropsyid,
				wn.commonname,
				wn.speciesid,
				wn.necropsydate,
				wn.sex,
				wn.location,
				wn.gridcell,
				wn.datereceived,
				wn.datekilled,
				wn.ageclass,
				wn.ageestimated,
				wn.submitter,
				wn.contactinfo,
				wn.regionid,
				wn.methodkilled,
				wn.injuries,
				wn.tagcomments,
				wn.tagrecheck,
				wn.bodywt_unskinned,
				wn.neckgirth_unsk,
				wn.chestgirth_unsk,
				wn.contour_nose_tail,
				wn.tail_length,
				wn.bodywt_skinned,
				wn.peltwt,
				wn.neckgirth_sk,
				wn.chestgirth_sk,
				wn.rumpfat,
				wn.totalrank_ext,
				wn.tongue,
				wn.haircollected,
				wn.skullcollected,
				wn.hindlegmuscle_stableisotopes,
				wn.hindlegmuscle_contaminants,
				wn.femur,
				wn.feces,
				wn.diaphragm,
				wn.lung,
				wn.liver_dna,
				wn.liver_sia,
				wn.liver_contam,
				wn.spleen,
				wn.kidneyl,
				wn.kidneyl_wt,
				wn.kidneyr,
				wn.kidneyr_wt,
				wn.blood_tabs,
				wn.blood_tubes,
				wn.stomach,
				wn.stomachcont,
				wn.stomach_full,
				wn.stomach_empty,
				wn.stomachcont_wt,
				wn.stomachcontentdesc,
				wn.intestinaltract,
				wn.uterinescars,
				wn.uterus,
				wn.ovaries,
				wn.lymphnodes,
				wn.others,
				wn.internalrank,
				wn.peltcolor,
				wn.backfat,
				wn.sternumfat,
				wn.inguinalfat,
				wn.incentive,
				wn.incentiveamt,
				wn.conflict,
				wn.groupsize,
				wn.packid,
				wn.xiphoid,
				wn.personnel,
				wn.pictures,
				wn.speciescomments,
				wn.taginjurycomments,
				wn.injurycomments,
				wn.examinjurycomments,
				wn.examcomments,
				wn.picturescomments,
				wn.measurementscomments,
				wn.missingpartscomments,
				wn.stomachcontents,
				wn.othersamplescomments,
				wn.samplescomments,
				wn.generalcomments
	        ];
	        return _.every(fields, function(field) {
	            return $.trim(field()) != "";
	        });
	    });
		
		this.saveWolfNecropsy = function () {
			var waitingScreenId = wmis.global.showWaitingScreen("Saving...");
			$.ajax({
				url: "/api/wolfnecropsy/",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(ko.toJS(self.wn())),
			}).success(function (wolfNecropsyKey) {
				window.location.href = "/wolfNecropsy/";

			}).always(function () {
				wmis.global.hideWaitingScreen(waitingScreenId);
			}).fail(wmis.global.ajaxErrorHandler);
		};
	}

	function initialize(initOptions) {
		$.extend(options, initOptions);

		var viewModel = new editWolfNecropsyViewModel();
		ko.applyBindings(viewModel);
	}

	return {
		initialize: initialize
	};
}(jQuery));