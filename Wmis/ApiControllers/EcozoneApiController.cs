namespace Wmis.ApiControllers
{
	using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

	/// <summary>
	/// The Ecozone API Controller
	/// </summary>
	[RoutePrefix("api/ecozone")]
	public class EcozoneApiController : BaseApiController
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="EcozoneApiController"/> class
		/// </summary>
		/// <param name="config">The config</param>
		public EcozoneApiController(WebConfiguration config) 
			: base(config)
		{
		}

		/// <summary>
		/// Gets all Ecozones
		/// </summary>
		/// <param name="request">The Ecozone Request details to filter by</param>
		/// <returns>The list of matching Ecozone objects</returns>
		[HttpGet]
		[Route]
		public PagedResultset<Ecozone> GetEcozones([FromUri]EcozoneRequest request)
		{
			return Repository.EcozoneGet(request ?? new EcozoneRequest());
		}

		/// <summary>
		/// Create or update an Ecozone
		/// </summary>
		/// <param name="request">The Ecozone details</param>
		[HttpPost]
		[Route]
		public void SaveEcozone([FromBody]EcozoneSaveRequest request)
		{
			Repository.EcozoneSave(request);
		}
    }
}
