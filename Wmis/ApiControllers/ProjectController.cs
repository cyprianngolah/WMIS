namespace Wmis.ApiControllers
{
	using System.Collections.Generic;
	using System.Web.Http;
	using Configuration;

	using Wmis.Dto;

	[RoutePrefix("api/project")]
	public class ProjectController : BaseApiController
    {
		public ProjectController(WebConfiguration config) 
			: base(config)
		{
		}

		#region Projects
		[HttpGet]
		[Route]
		public Dto.PagedResultset<Models.Project> SearchProjects([FromUri]Dto.ProjectRequest pr)
		{
			return Repository.ProjectSearch(pr);
		}

		[HttpGet]
		[Route("{projectKey:int}")]
		public Models.Project GetProject(int projectKey)
		{
			return Repository.ProjectGet(projectKey);
		}

		[HttpPost]
		[Route]
		public int Create([FromBody]string name)
		{
			return Repository.ProjectCreate(name);
		}

		[HttpPut]
		[Route]
		public void Update(Models.Project p)
		{
			Repository.ProjectUpdate(p);
		}
		#endregion

		#region Project Surveys
		[HttpGet]
		[Route("{projectKey:int}/surveys")]
		public Dto.PagedResultset<Models.ProjectSurvey> GetSurveys([FromUri]Dto.ProjectSurveyRequest psr)
		{
			return Repository.ProjectSurveyGet(psr);
		}

		[HttpGet]
		[Route("survey/{surveyKey:int}")]
		public Models.ProjectSurvey GetSurvey(int surveyKey)
		{
			return Repository.ProjectSurveyGet(surveyKey);
		}

		[HttpPost]
		[Route("survey")]
		public int CreateSurvey(Models.ProjectSurvey pssr)
		{
			return Repository.ProjectSurveySave(pssr);
		}

		[HttpPut]
		[Route("survey")]
		public void UpdateSurvey(Models.ProjectSurvey pssr)
		{
			Repository.ProjectSurveySave(pssr);
		}
		#endregion

		#region Project Survey Types
		[HttpGet]
		[Route("surveytype")]
		public Dto.PagedResultset<Models.SurveyType> GetProjectSurveyTypes(Dto.SurveyTypeRequest str)
		{
			return Repository.SurveyTypeSearch(str ?? new SurveyTypeRequest());
		}
		#endregion

		#region Project Collars
		[HttpGet]
		[Route("{projectKey:int}/collars")]
		public Dto.PagedResultset<Models.Collar> GetCollars([FromUri]Dto.ProjectCollarRequest psr)
		{
			return Repository.ProjectCollarGet(psr);
		}
		#endregion

		#region Project Statuses
		[HttpGet]
		[Route("statuses")]
		public Dto.PagedResultset<Models.ProjectStatus> GetProjectStatuses(Dto.ProjectStatusRequest psr)
		{
			return Repository.ProjectStatusSearch(psr ?? new ProjectStatusRequest());
		}
		#endregion
	}
}