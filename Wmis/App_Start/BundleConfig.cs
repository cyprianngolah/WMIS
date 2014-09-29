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
						"~/js/wmis.js"));

			bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
						"~/Scripts/knockout-*",
						"~/Scripts/knockout.mapper.js",
						"~/js/wmis.knockout.js"));

			bundles.Add(new ScriptBundle("~/bundles/datePicker").Include(
						"~/Scripts/select2.js"));

			bundles.Add(new ScriptBundle("~/bundles/select2").Include(
						"~/Scripts/datepicker/bootstrap-datepicker.js"));

			bundles.Add(new ScriptBundle("~/bundles/datatables").Include(
						"~/Scripts/DataTables-1.10.0/jquery.dataTables.js",
						"~/Scripts/DataTables-1.10.0/dataTables.bootstrap.js"));

			//////////////////////////////////////////////////////////////////////
			// Library/App Styles
			//////////////////////////////////////////////////////////////////////
			bundles.Add(new StyleBundle("~/bundles/css").Include(
						"~/Content/bootstrap.css",
						"~/Content/bootstrap-theme.css",
						"~/Content/site.css"));

			bundles.Add(new StyleBundle("~/bundles/datePickerCss").Include(
						"~/content/datepicker3.css"));

			bundles.Add(new StyleBundle("~/bundles/select2css").Include(
						"~/content/css/select2.css",
						"~/content/select2-bootstrap.css"));

			bundles.Add(new StyleBundle("~/bundles/content/datatables").Include(
						"~/content/datatables-1.10.0/css/jquery.dataTables.css",
						"~/content/datatables-1.10.0/css/dataTables.bootstrap.css"));

			//////////////////////////////////////////////////////////////////////
			// Module Script Bundles
			//////////////////////////////////////////////////////////////////////
			#region Biodiversity
			bundles.Add(new ScriptBundle("~/bundles/biodiversity/index").Include(
						"~/js/modules/wmis.biodiversity.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/new").Include(
						"~/js/modules/wmis.biodiversity.new.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/edit").Include(
						"~/js/modules/wmis.biodiversity.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/decision/edit").Include(
			"~/js/modules/wmis.biodiversity.decision.edit.js"));
			#endregion

			#region Projects
			bundles.Add(new ScriptBundle("~/bundles/project/index").Include(
						"~/js/modules/wmis.project.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/new").Include(
						"~/js/modules/wmis.project.new.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/edit").Include(
						"~/js/modules/wmis.project.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/project/survey/edit").Include(
						"~/js/modules/wmis.project.survey.edit.js"));
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
			#endregion
		}
	}
}
