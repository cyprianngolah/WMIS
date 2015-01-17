namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Web.Http;
	using Configuration;

	using Wmis.Dto;
	using Wmis.Models;

    [RoutePrefix("api/collaborator")]
	public class CollaboratorApiController : BaseApiController
    {
        public CollaboratorApiController(WebConfiguration config) 
			: base(config)
		{
		}
        
        [HttpGet]
        [Route("{collaboratorKey:int}")]
        public Collaborator GetCollaborator(int collaboratorKey)
        {
            return Repository.CollaboratorGet(collaboratorKey);
        }  

        [HttpGet]
        [Route]
        public PagedResultset<Collaborator> SearchCollaborators([FromUri]PagedDataKeywordRequest request)
        {
            return Repository.CollaboratorSearch(request);
        }

        [HttpPost]
        [Route]
        public int CreateCollaborator([FromBody]CollaboratorCreateRequest request)
        {
            return Repository.CollaboratorCreate(request);
        }

        [HttpPut]
        [Route]
        public void UpdateCollaborator([FromBody]Collaborator collaborator)
        {
            Repository.CollaboratorUpdate(collaborator);
        }

        [HttpGet]
        [Route("project/{projectId:int}")]
        public IEnumerable<Collaborator> GetProjectCollaborators(int projectId)
        {
            return Repository.ProjectCollaboratorsGet(projectId);
        }

        [HttpPut]
        [Route("project")]
        public void UpdateProjectCollaborators([FromBody]ProjectCollaboratorsUpdateRequest p)
        {
            Repository.ProjectCollaboratorsUpdate(p);
        }
    }
}