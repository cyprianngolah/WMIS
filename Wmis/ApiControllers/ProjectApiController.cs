namespace Wmis.ApiControllers
{
	using System.Web.Http;
	using Configuration;

	using Wmis.Auth;
	using Wmis.Dto;
	using Wmis.Models;

    [RoutePrefix("api/project")]
	public class ProjectApiController : BaseApiController
    {
	    private readonly Auth.WmisUser _user;

		public ProjectApiController(WebConfiguration config, Auth.WmisUser user) 
			: base(config)
		{
			_user = user;
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
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
		public int Create([FromBody]string name)
		{
			return Repository.ProjectCreate(name);
		}

		[HttpPut]
		[Route]
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
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
			return surveyKey > 0 ? this.Repository.ProjectSurveyGet(surveyKey) : new Models.ProjectSurvey { TargetSpecies = new Models.SpeciesType(), SurveyType = new Models.SurveyType(), Template = new Models.SurveyTemplate() };
		}

		[HttpPost]
		[Route("survey")]
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
		public int CreateSurvey(Models.ProjectSurvey pssr)
		{
			return Repository.ProjectSurveySave(pssr);
		}

		[HttpPut]
		[Route("survey")]
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
		public void UpdateSurvey(Models.ProjectSurvey pssr)
		{
			Repository.ProjectSurveySave(pssr);
		}
		#endregion

		#region Project Survey Types
		[HttpGet]
		[Route("surveytype")]
        public Dto.PagedResultset<Models.SurveyType> GetProjectSurveyTypes([FromUri]Dto.SurveyTypeRequest str)
		{
            var surveyTypes = Repository.SurveyTypeSearch(str);
            if (str.IncludeAllOption)
            {
                var allType = new SurveyType()
                {
                    Key = -1,
                    Name = "All"
                };
                surveyTypes.Data.Insert(0, allType);
            }
            return surveyTypes;
		}
		#endregion

		#region Project CollaredAnimals
		[HttpGet]
		[Route("{projectKey:int}/collars")]
		public Dto.PagedResultset<Models.Collar> GetCollaredAnimals([FromUri]Dto.ProjectCollarRequest psr)
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