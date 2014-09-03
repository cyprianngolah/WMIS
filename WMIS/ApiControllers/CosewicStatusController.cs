using System.Web.Http;

namespace Wmis.ApiControllers
{
	using System.Collections.Generic;
	using Configuration;
	using Models;

	/// <summary>
	/// 
	/// </summary>
	[RoutePrefix("api/cosewicstatus")]
	public class CosewicStatusController : BaseApiController
	{
		public CosewicStatusController(WebConfiguration config)
			: base(config)
		{
		}

		[HttpGet]
		[Route()]
		public IEnumerable<CosewicStatus> GetCosewicStatus()
		{
			return Repository.CosewicStatusGet();
		}
	}
}