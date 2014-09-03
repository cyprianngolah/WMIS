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
			// Basic Bundle includes jQuery, Twitter Bootstrap, Modernizer and some Global JavaScript helpers
			bundles.Add(new ScriptBundle("~/bundles/base").Include(
						"~/Scripts/jquery-{version}.js",
						"~/Scripts/bootstrap.js",
						"~/Scripts/respond.js",
						"~/Scripts/modernizr-*",
						"~/js/wmis.js"));

			bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
						"~/Scripts/knockout-*",
						"~/Scripts/knockout.mapper.js",
						"~/js/wmis.knockout.js"));


			bundles.Add(new ScriptBundle("~/bundles/select2").Include(
						"~/Scripts/select2.js"));

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

			bundles.Add(new StyleBundle("~/bundles/content/datatables").Include(
						"~/content/datatables-1.10.0/css/jquery.dataTables.css",
						"~/content/datatables-1.10.0/css/dataTables.bootstrap.css"));

			bundles.Add(new StyleBundle("~/bundles/select2css").Include(
						"~/content/css/select2.css",
						"~/content/select2-bootstrap.css"));

			//////////////////////////////////////////////////////////////////////
			// Module Script Bundles
			//////////////////////////////////////////////////////////////////////
			bundles.Add(new ScriptBundle("~/bundles/dialog/synonym").Include(
						"~/js/modules/wmis.dialog.synonym.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/index").Include(
						"~/js/modules/wmis.biodiversity.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/new").Include(
						"~/js/modules/wmis.biodiversity.new.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/edit").Include(
						"~/js/modules/wmis.biodiversity.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/biodiversity/decision/edit").Include(
						"~/js/modules/wmis.biodiversity.decision.edit.js"));

			bundles.Add(new ScriptBundle("~/bundles/taxonomy/index").Include(
						"~/js/modules/wmis.taxonomy.index.js"));

			bundles.Add(new ScriptBundle("~/bundles/taxonomy/edit").Include(
						"~/js/modules/wmis.taxonomy.edit.js"));
		}
	}
}
