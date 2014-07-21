namespace Wmis
{
	using System.Web.Http;

	/// <summary>
	/// The Web API Configuration
	/// </summary>
	public static class WebApiConfig
    {
		/// <summary>
		/// Registers the Web API Config
		/// </summary>
		/// <param name="config">The Global Http Configuration</param>
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

			// config.Routes.MapHttpRoute(
			//	name: "DefaultApi",
			//	routeTemplate: "api/{controller}/{id}",
			//	defaults: new { id = RouteParameter.Optional }
			// );
        }
    }
}
