namespace Wmis.ApiControllers
{
    using System.Web.Http;

	using Wmis.Configuration;
	using Wmis.Dto;

	[RoutePrefix("api/person")]
	public class PersonController : BaseApiController
    {
		public PersonController(WebConfiguration config) 
			: base(config)
		{
		}

		[HttpGet]
		[Route("projectLeads")]
		public PagedResultset<Models.Person> GetProjectLeads()
		{
			return Repository.PersonSearch(new PersonRequest { Role = "Project Lead" });
		}
    }
}
