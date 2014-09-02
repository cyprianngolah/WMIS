namespace Wmis.ApiControllers
{
	using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

	/// <summary>
	/// Ecoregion API Controller
	/// </summary>
	[RoutePrefix("api/ecoregion")]
	public class EcoregionApiController : BaseApiController
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="EcoregionApiController"/> class
		/// </summary>
		/// <param name="config">The config</param>
		public EcoregionApiController(WebConfiguration config) 
			: base(config)
		{
		}

		/// <summary>
		/// Gets all Ecoregions
		/// </summary>
		/// <param name="request">The Ecoregion Request details to filter by</param>
		/// <returns>The list of matching Ecoregion objects</returns>
		[HttpGet]
		[Route]
		public PagedResultset<Ecoregion> GetEcoregions([FromUri]EcoregionRequest request)
		{
			return Repository.EcoregionGet(request ?? new EcoregionRequest());
		}
    }
}
