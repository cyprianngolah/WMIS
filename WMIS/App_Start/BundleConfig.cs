namespace Wmis
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
			//////////////////////////////////////////////////////////////////////
			// Scripts
			//////////////////////////////////////////////////////////////////////
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
						"~/Scripts/jquery-{version}.js"));

			bundles.Add(new ScriptBundle("~/bundles/knockout").Include("~/Scripts/knockout-*"));

			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
					  "~/Scripts/bootstrap.js",
					  "~/Scripts/respond.js"));

			bundles.Add(new ScriptBundle("~/bundles/datatables").Include(
				"~/Scripts/DataTables-1.10.0/jquery.dataTables.js",
				"~/Scripts/DataTables-1.10.0/dataTables.bootstrap.js"));

			//////////////////////////////////////////////////////////////////////
			// Styles
			//////////////////////////////////////////////////////////////////////
			bundles.Add(new StyleBundle("~/Content/css").Include(
					  "~/Content/bootstrap.css",
					  "~/Content/bootstrap-theme.css",
					  "~/Content/site.css"));

			bundles.Add(new StyleBundle("~/Content/datatables").Include(
					  "~/Content/DataTables-1.10.0/css/jquery.dataTables.css",
					  "~/Content/DataTables-1.10.0/css/dataTables.bootstrap.css"));
		}
	}
}
