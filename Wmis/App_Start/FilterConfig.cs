namespace Wmis.App_Start
{
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
			filters.Add(new Auth.WmisAuthorizeAttribute { EnvironmentName = configuration.CurrentEnvironment, Roles = "ENR WMIS User" });
		}
	}
}
