// ReSharper disable All
namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Web.Http;

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
        public Person GetPerson(int userId)
        {
            var person =  Repository.PersonGet(userId);

            person.HasAdministratorBiodiversityRole = (person.Roles != null && person.Roles.Exists(x => x.Name == Role.ADMINISTRATOR_BIODIVERSITY_ROLE));
            person.HasAdministratorProjectRole = (person.Roles != null && person.Roles.Exists(x => x.Name == Role.ADMINISTRATOR_PROJECTS_ROLE));
            person.Roles.Clear();

            return person;
        }

        [HttpGet]
        [Route]
        public PagedResultset<Person> GetUsers([FromUri]PagedDataKeywordRequest request)
        {
            return Repository.PersonSearch(request ?? new PagedDataKeywordRequest());
        }

        [HttpGet]
        [Route("userRoles")]
        public IEnumerable<Role> GetUserRoles()
        {
            return Repository.UserRolesGet();
        }

		[HttpGet]
		[Route("projectLeads")]
		public PagedResultset<Models.Person> GetProjectLeads()
		{
			return Repository.PersonSearch(new PersonRequest { Role = "Project Lead" });
		}

        [HttpPost]
        [Route]
        public int Create([FromBody]PersonNew un)
        {
            return Repository.PersonCreate(un);
        }

        [HttpPut]
        [Route]
        public void Update([FromBody]Person u)
        {
            Repository.PersonUpdate(u);
        }
    }
}
