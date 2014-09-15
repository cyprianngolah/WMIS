namespace Wmis.ApiControllers
{
	using System.Collections.Generic;
	using System.Web.Http;
	using Configuration;
	using Models;

	[RoutePrefix("api/references")]
	public class ReferenceController : BaseApiController
    {
		public ReferenceController(WebConfiguration config) 
			: base(config)
		{
		}

		[HttpGet]
		[Route()]
		public Dto.PagedResultset<Reference> GetReferences([FromUri]Dto.ReferenceRequest rr)
		{
			return Repository.ReferencesGet(rr);
		}

		[HttpPost]
		[Route()]
		public void SaveReference(Models.Reference r)
		{
			Repository.ReferenceSave(r);
		}
    }
}
