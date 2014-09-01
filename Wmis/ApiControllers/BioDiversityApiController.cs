namespace Wmis.ApiControllers
{
	using System.Net;
	using System.Net.Http;
	using System.Web.Http;
	using Configuration;

	/// <summary>
	/// Bio Diversity API Controller
	/// </summary>
	[RoutePrefix("api/biodiversity")]
	public class BioDiversityController : BaseApiController
    {
		public BioDiversityController(WebConfiguration config) 
			: base(config)
		{
		}

		/// <summary>
		/// Gets the list of BioDiversity information based on the searchRequestParameters
		/// </summary>
		/// <param name="searchRequestParameters">The parameters used when searching for BioDiversity data</param>
		/// <returns>The paged data for BioDiversity</returns>
		[HttpGet]
		[Route]
		public Dto.PagedResultset<Models.BioDiversity> Get([FromUri]Dto.BioDiversitySearchRequest searchRequestParameters)
		{
			return Repository.BioDiversityGet(searchRequestParameters);
		}

		[HttpGet]
		[Route("{bioDiversityKey:int?}")]
		public Models.BioDiversity Get(int bioDiversityKey)
		{
			return Repository.BioDiversityGet(bioDiversityKey);
		}

		[HttpPost]
		[Route]
		public HttpResponseMessage Create([FromBody]string name)
		{
			Repository.BioDiversityCreate(name);
			return Request.CreateResponse(HttpStatusCode.OK);
		}

		[HttpPut]
		[Route]
		public HttpResponseMessage Update([FromBody]Dto.BioDiversityUpdateRequest up)
		{
			Repository.BioDiversityUpdate(up);
			return Request.CreateResponse(HttpStatusCode.OK);
		}


		[HttpGet]
		[Route("decision/{bioDiversityKey:int?}")]
		public Models.BioDiversityDecision BiodDiversityDecisionGet(int bioDiversityKey)
		{
			return Repository.BioDiversityDecisionGet(bioDiversityKey);
		}

		[HttpPut]
		[Route("decision")]
		public HttpResponseMessage BioDiversityDecisionUpdate([FromBody]Dto.BioDiversityDecisionUpdateRequest ur)
		{
			Repository.BioDiversityDecisionUpdate(ur);
			return Request.CreateResponse(HttpStatusCode.OK);
		}
    }
}
