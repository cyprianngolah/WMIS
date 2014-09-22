namespace Wmis.ApiControllers
{
	using System.Collections.Generic;
	using System.Web.Http;

	[RoutePrefix("api/person")]
	public class PersonController : ApiController
    {
		[HttpGet]
		[Route("projectLeads")]
		public IEnumerable<Models.Person> Get()
		{
			return new List<Models.Person>();
		}
    }
}
