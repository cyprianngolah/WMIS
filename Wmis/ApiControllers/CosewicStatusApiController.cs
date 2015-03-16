namespace Wmis.ApiControllers
{
    using System.Web.Http;
    using Configuration;
    using Dto;
    using Models;

    using Wmis.Auth;

	/// <summary>
    /// The COSEWIC Status API Controller
    /// </summary>
    [RoutePrefix("api/cosewicstatus")]
    public class CosewicStatusApiController : BaseApiController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CosewicStatusApiController"/> class
        /// </summary>
        /// <param name="config">The config</param>
        public CosewicStatusApiController(WebConfiguration config)
            : base(config)
        {
        }

        /// <summary>
        /// Gets all Status Ranks
        /// </summary>
        /// <param name="request">The Cosewic Status Request details to filter by</param>
        /// <returns>The list of matching Cosewic Status objects</returns>
        [HttpGet]
        [Route]
        public PagedResultset<CosewicStatus> GetCosewicStatus([FromUri]CosewicStatusRequest request)
        {
            return Repository.CosewicStatusGet(request ?? new CosewicStatusRequest());
        }

        /// <summary>
        /// Create or update a Cosewic Status
        /// </summary>
        /// <param name="request">The Cosewic Status details</param>
        [HttpPost]
        [Route]
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity)]
        public void SaveStatusRank([FromBody]CosewicStatusSaveRequest request)
        {
            Repository.CosewicStatusSave(request);
        }
    }
}