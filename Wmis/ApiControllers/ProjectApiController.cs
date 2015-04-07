namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;
    using Configuration;

    using Wmis.Auth;
    using Wmis.Dto;
    using Wmis.Models;
    using System.Net;
    using System;

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
            return Repository.ProjectCreate(name, _user.Username);
        }

        [HttpPut]
        [Route]
        public void Update(Models.Project p)
        {
            var username = User.Identity.Name;
            var repo = WebApi.ObjectFactory.Container.GetInstance<Models.WmisRepository>();
            var person = repo.PersonGet(username);

            // All administrators can see the sensitive data
            if (person.Roles.Select(r => r.Name).Contains(WmisRoles.AdministratorProjects) || person.Projects.Select(pk => pk.Key).Contains(p.Key))
            {
                Repository.ProjectUpdate(p);
                return;
            }
            else // if they created the project, they can see sensitve data
            {
                var historyItemForCreator = repo.HistoryLogSearch(new HistoryLogSearchRequest { Item = "Project Created", ChangeBy = username, Key = p.Key, Table = "ProjectHistory" }).Data;

                if (historyItemForCreator.Count() > 0)
                {
                    Repository.ProjectUpdate(p);
                    return;
                }
            }

            throw new HttpResponseException(HttpStatusCode.Unauthorized);
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

        #region Project Users

        [HttpPost]
        [Route("updateUsers")]
        public void UpdateProjectUsers(ProjectUsersSaveRequest usr)
        {
            var project = Repository.ProjectGet(usr.Key);

            if (project == null)
                return;

            var oldUsersIds = Repository.PersonSearch(new PersonRequest()).Data.Where(u => u.Projects.Select(p => p.Key).Contains(usr.Key)).Select(u => u.Key);

            var toAdd = new List<int>();
            var toRemove = new List<int>();

            foreach (var userId in usr.UserIds)
            {
                if (!oldUsersIds.Contains(userId))
                    toAdd.Add(userId);
            }

            foreach (var userId in oldUsersIds)
            {
                if (!usr.UserIds.Contains(userId))
                    toRemove.Add(userId);
            }

            if (toAdd.Count > 0)
            {
                foreach (var userId in toAdd)
                {
                    var person = Repository.PersonGet(userId);

                    if (person == null)
                        continue;

                    person.Projects.Add(new SimpleProject { Key = project.Key });

                    Repository.PersonUpdate(person);
                }
            }

            if (toRemove.Count > 0)
            {
                foreach (var userId in toRemove)
                {
                    var person = Repository.PersonGet(userId);

                    if (person == null)
                        continue;

                    person.Projects = person.Projects.Where(p => p.Key != project.Key).ToList();

                    Repository.PersonUpdate(person);
                }
            }
        }

        #endregion

        #region Sites

        [HttpGet]
        [Route("{projectKey:int}/sites")]
        public Dto.PagedResultset<Site> GetSites([FromUri]SiteRequest sr)
        {
            return Repository.SiteGet(sr);
        }

        #endregion
    }
}