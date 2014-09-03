using System.Web.Http;

namespace Wmis.ApiControllers
{
	using System.Collections.Generic;
	using Configuration;
	using Models;

	/// <summary>
	/// 
	/// </summary>
	[RoutePrefix("api/statusrank")]
	public class StatusRankController : BaseApiController
	{
		public StatusRankController(WebConfiguration config)
			: base(config)
		{
		}

		[HttpGet]
		[Route()]
		public IEnumerable<StatusRank> GetStatusRank()
		{
			return Repository.StatusRankGet();
		}
	}
}