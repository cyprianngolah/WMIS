namespace Wmis
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
		public static void RegisterGlobalFilters(GlobalFilterCollection filters)
		{
			filters.Add(new HandleErrorAttribute());
		}
	}
}
