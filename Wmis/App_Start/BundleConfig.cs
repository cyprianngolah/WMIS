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
			bundles.Add(new ScriptBundle("~/bundles/base").Include(
						"~/Scripts/jquery-{version}.js",
						"~/Scripts/bootstrap.js",
						"~/Scripts/respond.js",
						"~/Scripts/modernizr-*",
						"~/Scripts/moment.js",
						"~/Scripts/underscore.js",
						"~/Scripts/q.js",
						"~/js/wmis.js"));

			bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
						"~/Scripts/knockout-*",
						"~/Scripts/knockout.mapper.js",
						"~/js/wmis.knockout.js"));

			bundles.Add(new ScriptBundle("~/bundles/datePicker").Include(
						"~/Scripts/datepicker/bootstrap-datepicker.js"));		

			bundles.Add(new ScriptBundle("~/bundles/select2").Include(
						"~/Scripts/select2.js"));

			bundles.Add(new ScriptBundle("~/bundles/datatables").Include(
						"~/Scripts/DataTables-1.10.3/jquery.dataTables.js",
						"~/Scripts/DataTables-1.10.3/dataTables.bootstrap.js"));

			//////////////////////////////////////////////////////////////////////
			// Library/App Styles
			//////////////////////////////////////////////////////////////////////
			bundles.Add(new StyleBundle("~/bundles/css").Include(
						"~/Content/bootstrap-cerulean.css",
						"~/Content/site.css"));

			bundles.Add(new StyleBundle("~/bundles/datePickerCss").Include(
						"~/content/datepicker3.css"));

			bundles.Add(new StyleBundle("~/bundles/select2css").Include(
						"~/content/css/select2.css",
						"~/content/select2-bootstrap.css"));

			bundles.Add(new StyleBundle("~/bundles/content/datatables").Include(
						"~/content/datatables-1.10.3/css/jquery.dataTables.css",
						"~/content/datatables-1.10.3/css/dataTables.bootstrap.css"));

			//////////////////////////////////////////////////////////////////////
			// Module Script Bundles
			//////////////////////////////////////////////////////////////////////
			#region Biodiversity
			bundles.Add(new ScriptBundle("~/bundles/biodiversity/index").Include(
						"~/js/modules/wmis.biodiversity.index.js"));

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
		}
	}
}
