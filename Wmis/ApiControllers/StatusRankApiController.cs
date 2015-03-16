namespace Wmis.ApiControllers
{
    using System.Web.Http;
	using Configuration;
    using Dto;
	using Models;

    using Wmis.Auth;

	/// <summary>
	/// The Status Rank API Controller
	/// </summary>
	[RoutePrefix("api/statusrank")]
	public class StatusRankApiController : BaseApiController
	{
        /// <summary>
        /// Initializes a new instance of the <see cref="StatusRankApiController"/> class
        /// </summary>
        /// <param name="config">The config</param>
        public StatusRankApiController(WebConfiguration config)
			: base(config)
		{
		}

        /// <summary>
        /// Gets all Status Ranks
        /// </summary>
        /// <param name="request">The Status Rank Request details to filter by</param>
        /// <returns>The list of matching Status Rank objects</returns>
        [HttpGet]
        [Route]
        public PagedResultset<StatusRank> GetStatusRank([FromUri]StatusRankRequest request)
        {
            return Repository.StatusRankGet(request ?? new StatusRankRequest());
        }

        /// <summary>
        /// Create or update a Status Rank
        /// </summary>
        /// <param name="request">The Status Rank details</param>
        [HttpPost]
        [Route]
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity)]
        public void SaveStatusRank([FromBody]StatusRankSaveRequest request)
        {
            Repository.StatusRankSave(request);
        }
	}
}