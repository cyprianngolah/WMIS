namespace Wmis.App_Start
{
	using System.Web.Http;
	using Newtonsoft.Json.Converters;
	using Newtonsoft.Json.Serialization;

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

			var js = config.Formatters.JsonFormatter;
			js.Indent = true;

			// Camel Case the Json output
			js.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
	
			// Force Json Serializer to not "round" Timestamps when serializing because IE 8/9 expect EXACTLY 3 DIGITS FOR MILLISECONDS when parsing Dates
			js.SerializerSettings.Converters.Add(new IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd\\THH:mm:ss.fffK" });
			js.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
			js.SerializerSettings.DateParseHandling = Newtonsoft.Json.DateParseHandling.DateTime;
			js.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;

			config.Formatters.XmlFormatter.Indent = true;
			config.Formatters.XmlFormatter.UseXmlSerializer = true;

			// config.Routes.MapHttpRoute(
			//	name: "DefaultApi",
			//	routeTemplate: "api/{controller}/{id}",
			//	defaults: new { id = RouteParameter.Optional }
			// );
        }
    }
}
