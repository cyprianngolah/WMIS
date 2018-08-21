namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;
    using Configuration;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.IO;
    using NPOI.HSSF.UserModel;

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
        [Route("download")]
        public HttpResponseMessage DownloadProjects([FromUri]ProjectRequest pr)
        {
            var lstData = Repository.ProjectDownload(pr);

            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet("Projects");

            var header = sheet.CreateRow(0);
            header.CreateCell(0).SetCellValue("Project Number");
            header.CreateCell(1).SetCellValue("Title");
            header.CreateCell(2).SetCellValue("Region");
            header.CreateCell(3).SetCellValue("Project Lead");
            header.CreateCell(4).SetCellValue("Start Date");
            header.CreateCell(5).SetCellValue("Last Updated");
            header.CreateCell(6).SetCellValue("Status");
            header.CreateCell(7).SetCellValue("Description");
            header.CreateCell(8).SetCellValue("Methods");
            header.CreateCell(9).SetCellValue("Collar Count");

            var rowIndex = 1;

            foreach(var data in lstData.Data)
            {
                var row = sheet.CreateRow(rowIndex);
                row.CreateCell(0).SetCellValue(data.ProjectNumber);
                row.CreateCell(1).SetCellValue(data.Name);
                row.CreateCell(2).SetCellValue(data.LeadRegion.Name);
                row.CreateCell(3).SetCellValue(data.ProjectLead.Name);
                row.CreateCell(4).SetCellValue(data.StartDate.ToString());
                row.CreateCell(5).SetCellValue(data.LastUpdated.ToString());
                row.CreateCell(6).SetCellValue(data.Status.Name);
                row.CreateCell(7).SetCellValue(data.Description);
                row.CreateCell(8).SetCellValue(data.Methods);
                row.CreateCell(9).SetCellValue(data.CollarCount);

                rowIndex++;
            }

            var directoryName = Path.Combine(Path.GetTempPath(), "WMIS");
            string strFile = "Projects_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
            string fullPath = Path.Combine(directoryName, strFile);

            if(!Directory.Exists(directoryName))
            {
                Directory.CreateDirectory(directoryName);
            }

            using (var fileStream = System.IO.File.Create(fullPath))
            {
                workbook.Write(fileStream);
            }

            if(System.IO.File.Exists(fullPath))
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = strFile
                };

                return response;
            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);
            

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
            return Repository.ProjectCreate(name, this._user.Username);
        }

        [HttpPut]
        [Route]
        public void Update(Models.Project p)
        {
            var repo = WebApi.ObjectFactory.Container.GetInstance<Models.WmisRepository>();
            var person = repo.PersonGet(_user.Username);

            // All administrators can see the sensitive data
            if (person.Roles.Select(r => r.Name).Contains(WmisRoles.AdministratorProjects) || person.Projects.Select(pk => pk.Key).Contains(p.Key))
            {
                Repository.ProjectUpdate(p, "");
                return;
            }
            var historyItemForCreator = repo.HistoryLogSearch(new HistoryLogSearchRequest { Item = "Project Created", ChangeBy = this._user.Username, Key = p.Key, Table = "ProjectHistory" }).Data;

            if (historyItemForCreator.Any())
            {
                this.Repository.ProjectUpdate(p, "");
                return;
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
        [Route("{projectKey:int}/surveys/download")]
        public HttpResponseMessage DownloadSurveys([FromUri]ProjectSurveyRequest psr)
        {
            var lstData = Repository.ProjectSurveyGet(psr);


            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet("Surveys");

            var header = sheet.CreateRow(0);
            header.CreateCell(0).SetCellValue("Survey Type");
            header.CreateCell(1).SetCellValue("Target Species");
            header.CreateCell(2).SetCellValue("Common Name");
            header.CreateCell(3).SetCellValue("Start Date");
            header.CreateCell(4).SetCellValue("Last Updated");
            header.CreateCell(5).SetCellValue("No. of Observations");
            header.CreateCell(6).SetCellValue("Description");
            header.CreateCell(7).SetCellValue("Method");
            header.CreateCell(8).SetCellValue("Project ID");
            header.CreateCell(9).SetCellValue("Survey Template");

            var rowIndex = 1;

            foreach (var data in lstData.Data)
            {
                var row = sheet.CreateRow(rowIndex);
                row.CreateCell(0).SetCellValue(data.SurveyType.Name);
                row.CreateCell(1).SetCellValue(data.TargetSpecies.Name);
                row.CreateCell(2).SetCellValue(data.TargetSpecies.CommonName);
                row.CreateCell(3).SetCellValue(data.StartDate.ToString());
                row.CreateCell(4).SetCellValue(data.LastUpdated.ToString());
                row.CreateCell(5).SetCellValue(data.ObservationCount);
                row.CreateCell(6).SetCellValue(data.Description);
                row.CreateCell(7).SetCellValue(data.Method);
                row.CreateCell(8).SetCellValue(data.ProjectKey);
                row.CreateCell(9).SetCellValue(data.Template.Name);

                rowIndex++;
            }

            var directoryName = Path.Combine(Path.GetTempPath(), "WMIS");
            string strFile = "Surveys_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
            string fullPath = Path.Combine(directoryName, strFile);

            if (!Directory.Exists(directoryName))
            {
                Directory.CreateDirectory(directoryName);
            }

            using (var fileStream = System.IO.File.Create(fullPath))
            {
                workbook.Write(fileStream);
            }

            if (System.IO.File.Exists(fullPath))
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = strFile
                };

                return response;
            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);


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
            return Repository.ProjectSurveySave(pssr, _user.Username);
        }

        [HttpPut]
        [Route("survey")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public void UpdateSurvey(Models.ProjectSurvey pssr)
        {
            Repository.ProjectSurveySave(pssr, _user.Username);
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