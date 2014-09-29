namespace Wmis.App_Start
{
	using System.Web.Mvc;
	using System.Web.Routing;

	/// <summary>
	/// The Route Configuration for the MVC Application
	/// </summary>
	public class RouteConfig
	{
		/// <summary>
		/// Registers the Routes
		/// </summary>
		/// <param name="routes">The Collection of Routes</param>
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

			routes.MapRoute(
				name: "Default",
				url: "{controller}/{action}/{key}",
				defaults: new { controller = "BioDiversity", action = "Index", key = UrlParameter.Optional });
		}
	}
}
