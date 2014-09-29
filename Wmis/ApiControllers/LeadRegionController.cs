namespace Wmis.ApiControllers
{
	using System.Web.Http;

	using Wmis.Configuration;
	using Wmis.Dto;

	[RoutePrefix("api/leadregion")]
	public class LeadRegionController : BaseApiController
    {
		public LeadRegionController(WebConfiguration config) 
			: base(config)
		{
		}

		[HttpGet]
		[Route]
		public Dto.PagedResultset<Models.LeadRegion> Get(Dto.LeadRegionRequest lrr)
		{
			return Repository.LeadRegionSearch(lrr ?? new LeadRegionRequest());
		}
    }
}
