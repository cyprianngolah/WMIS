// ReSharper disable All
namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;
    using System.Web.Security;

    using Wmis.Auth;
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
        [Route("applicationUsers")]
        public PagedResultset<Models.Person> GetUsers([FromUri]PersonRequest request)
        {
            var users = Repository.PersonSearch(request);
            //TODO: For now Lena only wants to see Admin's. This should change but will do it for now
			// How are you supposed to assign admins if you can't see a user?
			//users.Data = users.Data.FindAll( x => x.Roles.Exists( y =>
			//		y.Name == Role.ADMINISTRATOR_BIODIVERSITY_ROLE || y.Name == Role.ADMINISTRATOR_PROJECTS_ROLE));
            return users;
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

        [HttpGet]
        [Route("projectAdmins")]
        public PagedResultset<Models.Person> getProjectAdministrators()
        {
            return Repository.PersonSearch(new PersonRequest() { RoleName = Wmis.Models.Role.ADMINISTRATOR_PROJECTS_ROLE });
        }

        [HttpGet]
        [Route("projectUsers/{projectId:int}")]
        public PagedResultset<Models.Person> GetUsersForProject(int projectId)
        {
            var users = Repository.PersonSearch(new PersonRequest()).Data.Where(u => u.Projects.Select(p => p.Key).Contains(projectId));
            return new PagedResultset<Person> { Data = users.ToList(), ResultCount = users.Count() };
        }

        [HttpPost]
        [Route]
		[WmisWebApiAuthorize(Roles = WmisRoles.AllRoles)]
		public int Create([FromBody]Models.PersonNew un)
        {
            return Repository.PersonCreate(un);
        }

        [HttpPut]
        [Route]
		[WmisWebApiAuthorize(Roles = WmisRoles.AllRoles)]
		public void Update([FromBody]Models.Person u)
        {
            Repository.PersonUpdate(u);
        }
    }
}
