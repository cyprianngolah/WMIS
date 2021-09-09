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
                        //"~/Content/v2/DataTables.css",
                        "~/Content/v2/bootstrap5-datatable.css"
                        ));

            bundles.Add(new StyleBundle("~/bundles/select2css").Include(
                                    "~/Content/v2/select2.min.css",
                                    "~/Content/v2/select2-bootstrap5.min.css"));


            //////////////////////////////////////////////////////////////////////
            // Vue components
            //////////////////////////////////////////////////////////////////////
            bundles.Add(new ScriptBundle("~/bundles/components/base").Include(
                "~/js/v2/components/BaseComponents.js"));

            bundles.Add(new ScriptBundle("~/bundles/components/speciessynonymeditor").Include(
                "~/js/v2/components/SpeciesSynonymEditor.js"));

            bundles.Add(new ScriptBundle("~/bundles/components/ProjectSurveys").Include(
                "~/js/v2/components/ProjectSurveys.js"));

            bundles.Add(new ScriptBundle("~/bundles/components/SurveyObservations").Include(
                "~/js/v2/components/SurveyObservations.js"));

            bundles.Add(new ScriptBundle("~/bundles/components/CollaredAnimalMapping").Include(
                "~/js/v2/components/CollaredAnimalMapping.js")); 
            
            bundles.Add(new ScriptBundle("~/bundles/components/GMap").Include(
                "~/js/v2/components/GMap.js"));

            bundles.Add(new ScriptBundle("~/bundles/components/FileTab").Include(
                        "~/js/v2/components/FileTab.js"));
                
            bundles.Add(new ScriptBundle("~/bundles/components/HistoryTab").Include(
                        "~/js/v2/components/HistoryTab.js"));

            bundles.Add(new ScriptBundle("~/bundles/components/ProjectSites").Include(
                        "~/js/v2/components/projectSItes.js"));

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

            bundles.Add(new ScriptBundle("~/bundles/biodiversity/edit").Include(
                        "~/js/v2/modules/biodiversity/wmis.biodiversity.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/biodiversity/new").Include(
						"~/js/v2/modules/biodiversity/wmis.biodiversity.new.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/decision/edit").Include(
			            "~/js/v2/modules/biodiversity/wmis.biodiversity.decision.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/biodiversity/upload").Include(
                        "~/js/v2/modules/biodiversity/wmis.biodiversity.upload.js"));
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
                        "~/js/v2/modules/collaredanimals/wmis.collaredanimal.index.js"));


            bundles.Add(new ScriptBundle("~/bundles/collaredanimal/edit").Include(
                        "~/js/v2/modules/collaredanimals/wmis.collaredanimal.edit.js"));

            #endregion

            #region Projects
            bundles.Add(new ScriptBundle("~/bundles/project/index").Include(
						"~/js/v2/modules/project/wmis.project.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/new").Include(
                        "~/js/v2/modules/project/wmis.project.new.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/edit").Include(
                        "~/js/v2/modules/project/wmis.project.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/project/survey/new").Include(
                        "~/js/v2/modules/project/wmis.project.survey.new.js"));


            bundles.Add(new ScriptBundle("~/bundles/project/survey/edit").Include(
                        "~/js/v2/modules/project/wmis.project.survey.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/project/site/edit").Include(
                        "~/js/v2/modules/project/wmis.project.site.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/project/site/new").Include(
                        "~/js/v2/modules/project/wmis.project.site.new.js"));

            
			#endregion

            #region Search
            bundles.Add(new ScriptBundle("~/bundles/search/index").Include(
                        "~/js/wmis.mapping.js",
                        "~/js/modules/wmis.search.index.js"));
            #endregion
            
            #region Biodiversity Admin Pages
            bundles.Add(new ScriptBundle("~/bundles/taxonomy/index").Include(
						"~/js/v2/modules/biodiversity/wmis.taxonomy.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/taxonomy/new").Include(
                        "~/js/v2/modules/biodiversity/wmis.taxonomy.new.js"));

            bundles.Add(new ScriptBundle("~/bundles/taxonomy/edit").Include(
						"~/js/v2/modules/biodiversity/wmis.taxonomy.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/ecoregion/index").Include(
                        "~/js/v2/modules/ecoregion/wmis.ecoregion.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/ecoregion/edit").Include(
						"~/js/v2/modules/ecoregion/wmis.ecoregion.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/ecozone/index").Include(
						"~/js/v2/modules/ecozone/wmis.ecozone.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/ecozone/edit").Include(
						"~/js/v2/modules/ecozone/wmis.ecozone.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/protectedarea/index").Include(
                        "~/js/v2/modules/protectedarea/wmis.protectedarea.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/protectedarea/edit").Include(
						"~/js/v2/modules/protectedarea/wmis.protectedarea.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/reference/index").Include(
						"~/js/v2/modules/references/wmis.references.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/reference/edit").Include(
                        "~/js/v2/modules/references/wmis.references.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/ranks/index").Include(
                        "~/js/v2/modules/ranks/wmis.ranks.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/ranks/edit").Include(
                        "~/js/v2/modules/ranks/wmis.ranks.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/cosewicstatus/index").Include(
                        "~/js/v2/modules/cosewicstatus/wmis.cosewicstatus.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/cosewicstatus/edit").Include(
                        "~/js/v2/modules/cosewicstatus/wmis.cosewicstatus.edit.js"));

            bundles.Add(new ScriptBundle("~/bundles/nwtsarcassessment/index").Include(
                        "~/js/v2/modules/nwtsarcassessment/wmis.nwtsarcassessment.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/nwtsarcassessment/edit").Include(
                        "~/js/v2/modules/nwtsarcassessment/wmis.nwtsarcassessment.edit.js"));

            #endregion

            #region Admin pages

            bundles.Add(new ScriptBundle("~/bundles/user/index").Include(
                    "~/js/v2/modules/user/wmis.user.index.js"));

            bundles.Add(new ScriptBundle("~/bundles/user/edit").Include(
                        "~/js/v2/modules/user/wmis.user.edit.js"));


            /*bundles.Add(new ScriptBundle("~/bundles/shared/filetab").Include(
                        "~/js/modules/wmis.shared.filetab.js"));

            bundles.Add(new ScriptBundle("~/bundles/shared/historytab").Include(
                        "~/js/modules/wmis.shared.historytab.js"));*/

            bundles.Add(new ScriptBundle("~/bundles/surveytemplate/index").Include(
                        "~/js/v2/modules/surveytemplate/wmis.surveytemplate.index.js"));

            /*bundles.Add(new ScriptBundle("~/bundles/surveytemplate/new").Include(
                        "~/js/modules/wmis.surveytemplate.new.js"));*/
            
            bundles.Add(new ScriptBundle("~/bundles/surveytemplate/edit").Include(
                        "~/js/v2/modules/surveytemplate/wmis.surveytemplate.edit.js"));


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
