namespace Wmis.App_Start
{
	using System.Collections.Generic;
	using System.Web.Mvc;

	/// <summary>
	/// The Filter Config
	/// </summary>
	public class FilterConfig
	{
		/// <summary>
		/// Registers the Global Filters
		/// </summary>
		/// <param name="filters">The Filter Collection</param>
		public static void RegisterGlobalFilters(GlobalFilterCollection filters, Configuration.WebConfiguration configuration)
		{
			filters.Add(new HandleErrorAttribute());
			//filters.Add(new Auth.WmisAuthorizeAttribute
			//				{
			//					SkipForUsers = new List<string> { "james_maltby" },
			//					EnvironmentName = configuration.CurrentEnvironment, 
			//					ApplicableEnvironments = new List<string>{"dev", "test", "prod"},
			//					Roles = "ENR WMIS User"
			//				});
		}
	}
}
