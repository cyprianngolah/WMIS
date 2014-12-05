namespace Wmis.ApiControllers
{
	using System.Web.Http;

	using Wmis.Configuration;

	/// <summary>
	/// Bio Diversity API Controller
	/// </summary>
	[RoutePrefix("api/settings")]
	public class SettingsController : BaseApiController
	{
		public SettingsController(WebConfiguration config)
			: base(config)
		{
		}

		[HttpGet]
		[Route]
		public WebConfiguration Get()
		{
			return WebConfiguration;
		}
    }
}
