// ReSharper disable All
namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;
    using System.Web.Security;

    using Wmis.Configuration;
	using Wmis.Dto;
    using Wmis.Models;

    [RoutePrefix("api/person")]
	public class PersonController : BaseApiController
    {
		public PersonController(WebConfiguration config) 
			: base(config)
		{
		}

        [HttpGet]
        [Route("{userId:int?}")]
        public Models.Person GetPerson(int userId)
        {
	        return Repository.PersonGet(userId);
        }

        [HttpGet]
        [Route("users")]
        public PagedResultset<Models.Person> GetUsers([FromUri]PersonRequest request)
        {
            return Repository.PersonSearch(request);
        }

        [HttpGet]
        [Route("userRoles")]
        public PagedResultset<Models.Role> GetUserRoles(Dto.PagedRoleRequest request)
        {
            return Repository.UserRolesGet(request);
        }

		[HttpGet]
		[Route("projectLeads")]
		public PagedResultset<Models.Person> GetProjectLeads()
		{
		    return Repository.PersonSearch(new PersonRequest() {ProjectLeadsOnly = true});
		}

        [HttpPost]
        [Route]
		public int Create([FromBody]Models.PersonNew un)
        {
            return Repository.PersonCreate(un);
        }

        [HttpPut]
        [Route]
		public void Update([FromBody]Models.Person u)
        {
            Repository.PersonUpdate(u);
        }
    }
}
