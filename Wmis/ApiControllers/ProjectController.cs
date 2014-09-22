namespace Wmis.ApiControllers
{
	using System.Collections.Generic;
	using System.Web.Http;
	using Configuration;

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
		public Dto.PagedResultset<Models.Project> GetProjects([FromUri]Dto.ProjectRequest pr)
		{
			var r = new Dto.PagedResultset<Models.Project>
			{
				DataRequest = pr, 
				ResultCount = 0, 
				Data = new List<Models.Project>()
			};

			return r;
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
		public int CreateSurvey(Dto.ProjectSurveySaveRequest pssr)
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
		public IEnumerable<Models.ProjectStatus> GetProjectStatuses()
		{
			return new List<Models.ProjectStatus>();
		}
		#endregion
	}
}