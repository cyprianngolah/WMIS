namespace Wmis.App_Start
{
	using System.Web.Optimization;

	/// <summary>
	/// The CSS and JS Bundle Configuration
	/// </summary>
	public class BundleConfig
	{
		/// <summary>
		/// Registration of bundles
		/// </summary>
		/// <param name="bundles">Collection of bundles</param>
		public static void RegisterBundles(BundleCollection bundles)
		{
#if !DEBUG
			BundleTable.EnableOptimizations = true;
#endif
            //////////////////////////////////////////////////////////////////////
            // Library Script Bundles
            //////////////////////////////////////////////////////////////////////
            // Basic Bundle includes jQuery, Twitter Bootstrap, Modernizer, Moment and some Global JavaScript helpers
            bundles.Add(new Bundle("~/bundles/base").Include(
                "~/Scripts/v2/jquery3.min.js",
                "~/Scripts/v2/moment.js",
                "~/Scripts/v2/axios.min.js",
                "~/Scripts/v2/vue3.min.js",
                "~/Scripts/v2/elementui.js",
                "~/Scripts/v2/bootstrap5.bundle.min.js",
                "~/js/v2/wmis.js"
                ));

            /*bundles.Add(new ScriptBundle("~/bundles/vue").Include(
                        "~/Scripts/v2/axios.min.js",
                        "~/Scripts/v2/vue3.min.js",
                        "~/Scripts/v2/elementui.js"));*/

			bundles.Add(new ScriptBundle("~/bundles/select2").Include(
						"~/Scripts/v2/select2.js"));

            bundles.Add(new ScriptBundle("~/bundles/datatables").Include(
                        "~/Scripts/v2/DataTables.min.js"));
            //////////////////////////////////////////////////////////////////////
            // Library/App Styles
            //////////////////////////////////////////////////////////////////////
            bundles.Add(new StyleBundle("~/bundles/css").Include(
						"~/Content/v2/bootstrap5.min.css",
                        "~/Content/v2/elementui.css",
                        "~/Content/v2/site.css"));

            bundles.Add(new StyleBundle("~/bundles/datatablescss").Include(
                        "~/Content/v2/DataTables.css"));
            /*
                        bundles.Add(new StyleBundle("~/bundles/datePickerCss").Include(
                                    "~/content/datepicker3.css"));

                        bundles.Add(new StyleBundle("~/bundles/select2css").Include(
                                    "~/content/css/select2.css",
                                    "~/content/select2-bootstrap.css"));

                        bundles.Add(new StyleBundle("~/bundles/content/datatables").Include(
                                    "~/content/datatables-1.10.3/css/jquery.dataTables.css",
                                    "~/content/datatables-1.10.3/css/dataTables.bootstrap.css"));

                        bundles.Add(new StyleBundle("~/bundles/tabs").Include(
                                    "~/content/tabs.css"));*/

            //////////////////////////////////////////////////////////////////////
            // Module Script Bundles
            //////////////////////////////////////////////////////////////////////
            ///
            #region Homepage
            bundles.Add(new ScriptBundle("~/bundles/home/index").Include(
                        "~/js/v2/modules/home/wmis.home.js"));



            #endregion

            #region Biodiversity
            bundles.Add(new ScriptBundle("~/bundles/biodiversity/index").Include(
						"~/js/v2/modules/biodiversity/wmis.biodiversity.index.js"));



			bundles.Add(new ScriptBundle("~/bundles/biodiversity/new").Include(
						"~/js/modules/wmis.biodiversity.new.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/edit").Include(
						"~/js/modules/wmis.biodiversity.edit.synonyms.js",
						"~/js/modules/wmis.biodiversity.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/decision/edit").Include(
			"~/js/modules/wmis.biodiversity.decision.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/biodiversity/upload").Include(
            "~/js/modules/wmis.biodiversity.upload.js",
            "~/js/wmis.knockout.js"));
            #endregion

            #region WMIS  Tools

            bundles.Add(new ScriptBundle("~/bundles/tools/batchreject").Include(
                    "~/js/vuemodules/wmis.tools.batchreject.js"));

            bundles.Add(new ScriptBundle("~/bundles/tools/othercleanup").Include(
                    "~/js/vuemodules/wmis.tools.othercleanup.js"));

            bundles.Add(new ScriptBundle("~/bundles/tools/resetherdpopulation").Include(
                    "~/js/vuemodules/wmis.tools.resetherdpopulation.js"));

            bundles.Add(new ScriptBundle("~/bundles/tools/postretrievaldataprocessing").Include(
                    "~/js/vuemodules/wmis.tools.postretrievaldataprocessing.js"));

            bundles.Add(new ScriptBundle("~/bundles/tools/vectronicsdataprocessing").Include(
                    "~/js/vuemodules/wmis.tools.vectronicsdataprocessing.js"));

            bundles.Add(new ScriptBundle("~/bundles/tools/lotekiridiumdataprocessing").Include(
                    "~/js/vuemodules/wmis.tools.lotekiridiumdataprocessing.js"));

            bundles.Add(new ScriptBundle("~/bundles/tools/AddDataManually").Include(
                    "~/js/vuemodules/wmis.tools.adddatamanually.js"));

            #endregion


            #region Collared Animal
            bundles.Add(new ScriptBundle("~/bundles/collaredanimal/index").Include(
                        "~/js/modules/wmis.collaredanimal.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/collaredanimal/new").Include(
                        "~/js/modules/wmis.collaredanimal.new.js"));

            bundles.Add(new ScriptBundle("~/bundles/collaredanimal/edit").Include(
                        "~/js/wmis.mapping.js",
                        "~/js/modules/wmis.collaredanimal.mapping.js",
                        "~/js/modules/wmis.collaredanimal.editmodals.js",
                        "~/js/modules/wmis.collaredanimal.edit.js"));

            #endregion

			#region Projects
			bundles.Add(new ScriptBundle("~/bundles/project/index").Include(
						"~/js/modules/wmis.project.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/new").Include(
						"~/js/modules/wmis.project.new.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/edit").Include(
                        "~/js/modules/wmis.project.edit.js",
                        "~/js/modules/wmis.project.editmodals.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/survey/edit").Include(
						"~/js/wmis.mapping.js",
                        "~/js/modules/wmis.project.survey.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/survey/new").Include(
                        "~/js/modules/wmis.project.survey.new.js"));

            bundles.Add(new ScriptBundle("~/bundles/project/site/new").Include(
                        "~/js/modules/wmis.project.site.new.js"));

            bundles.Add(new ScriptBundle("~/bundles/project/site/edit").Include(
                        "~/js/modules/wmis.project.site.edit.js"));
			#endregion

            #region Search
            bundles.Add(new ScriptBundle("~/bundles/search/index").Include(
                        "~/js/wmis.mapping.js",
                        "~/js/modules/wmis.search.index.js"));
            #endregion
            
            #region Admin Pages
            bundles.Add(new ScriptBundle("~/bundles/taxonomy/index").Include(
						"~/js/modules/wmis.taxonomy.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/taxonomy/edit").Include(
						"~/js/modules/wmis.taxonomy.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/ecoregion/index").Include(
						"~/js/modules/wmis.ecoregion.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/ecoregion/edit").Include(
						"~/js/modules/wmis.ecoregion.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/ecozone/index").Include(
						"~/js/modules/wmis.ecozone.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/ecozone/edit").Include(
						"~/js/modules/wmis.ecozone.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/protectedarea/index").Include(
						"~/js/modules/wmis.protectedarea.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/protectedarea/edit").Include(
						"~/js/modules/wmis.protectedarea.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/reference/index").Include(
						"~/js/modules/wmis.reference.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/reference/edit").Include(
						"~/js/modules/wmis.reference.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/statusrank/index").Include(
                        "~/js/modules/wmis.statusrank.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/statusrank/edit").Include(
                        "~/js/modules/wmis.statusrank.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/cosewicstatus/index").Include(
                        "~/js/modules/wmis.cosewicstatus.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/cosewicstatus/edit").Include(
                        "~/js/modules/wmis.cosewicstatus.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/nwtsarcassessment/index").Include(
                        "~/js/modules/wmis.nwtsarcassessment.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/nwtsarcassessment/edit").Include(
                        "~/js/modules/wmis.nwtsarcassessment.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/user/index").Include(
                    "~/js/modules/wmis.user.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/user/edit").Include(
                        "~/js/modules/wmis.user.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/shared/filetab").Include(
                        "~/js/modules/wmis.shared.filetab.js"));

            bundles.Add(new ScriptBundle("~/bundles/shared/historytab").Include(
                        "~/js/modules/wmis.shared.historytab.js"));

            bundles.Add(new ScriptBundle("~/bundles/surveytemplate/index").Include(
                        "~/js/modules/wmis.surveytemplate.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/surveytemplate/new").Include(
                        "~/js/modules/wmis.surveytemplate.new.js"));
            
            bundles.Add(new ScriptBundle("~/bundles/surveytemplate/edit").Include(
                        "~/js/modules/wmis.surveytemplate.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/site/index").Include(
                        "~/js/modules/wmis.site.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/site/edit").Include(
                        "~/js/modules/wmis.site.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/argosservice/index").Include(
						"~/js/modules/wmis.argosservice.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/help/index").Include(
                        "~/js/modules/wmis.help.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/help/new").Include(
                        "~/js/modules/wmis.help.new.js"));

            bundles.Add(new ScriptBundle("~/bundles/help/edit").Include(
                        "~/js/modules/wmis.help.edit.js"));

            #endregion

            #region WolfNecropsies
            bundles.Add(new ScriptBundle("~/bundles/wolfnecropsy/index").Include(
                        "~/js/modules/wmis.wolfnecropsy.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/wolfnecropsy/edit").Include(
                        "~/js/modules/wmis.wolfnecropsy.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/wolfnecropsy/new").Include(
                        "~/js/modules/wmis.wolfnecropsy.new.js"));

            bundles.Add(new ScriptBundle("~/bundles/wolfnecropsy/upload").Include(
                        "~/js/modules/wmis.wolfnecropsy.upload.js",
                        "~/js/wmis.knockout.js"));

            #endregion

            #region RabiesTests
            bundles.Add(new ScriptBundle("~/bundles/rabiestests/index").Include(
                        "~/js/modules/wmis.rabiestests.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/rabiestests/edit").Include(
                        "~/js/modules/wmis.rabiestests.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/rabiestests/new").Include(
                        "~/js/modules/wmis.rabiestests.new.js"));

            bundles.Add(new ScriptBundle("~/bundles/rabiestests/upload").Include(
                        "~/js/modules/wmis.rabiestests.upload.js",
                        "~/js/wmis.knockout.js"));
            #endregion

        }
    }
}
