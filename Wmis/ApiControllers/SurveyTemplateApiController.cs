namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Web.Http;

    using Wmis.Auth;
    using Wmis.Configuration;
    using Wmis.Dto;
    using Wmis.Models;
    using Wmis.Models.Base;

    [RoutePrefix("api/surveytemplate")]
	public class SurveyTemplateApiController : BaseApiController
    {
        private readonly Auth.WmisUser _user;

        public SurveyTemplateApiController(WebConfiguration config, Auth.WmisUser user)
			: base(config)
		{
            _user = user;
		}

		[HttpGet]
		[Route]
        public Dto.PagedResultset<Models.SurveyTemplate> GetTemplates([FromUri]Dto.PagedDataKeywordRequest str)
		{
            return Repository.SurveyTemplateSearch(str ?? new Dto.PagedDataKeywordRequest());
		}

		[HttpGet]
		[Route("{surveyTemplateId:int}")]
        public SurveyTemplate GetTemplate(int surveyTemplateId)
		{
            return Repository.SurveyTemplateGet(surveyTemplateId);
		}

		[HttpGet]
        [Route("columntypes")]
        public List<NamedKeyedModel> GetSurveyTemplateColumnTypes()
		{
            return Repository.SurveyTemplateColumnTypesGet();
		}

		[HttpGet]
        [Route("columns/{surveyTemplateId:int}")]
        public IEnumerable<SurveyTemplateColumn> GetSurveyTemplateColumns(int surveyTemplateId)
		{
            return Repository.GetSurveyTemplateColumns(surveyTemplateId);
		}

        [HttpPost]
        [Route]
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public int Create([FromBody]SurveyTemplateSaveRequest request)
        {
            return Repository.SurveyTemplateSave(request, _user.Username);
        }
        
        [HttpPost]
        [Route("column")]
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public int CreateColumn([FromBody]SurveyTemplateColumnSaveRequest request)
        {
            return Repository.SurveyTemplateColumnSave(request);
        }

        [HttpDelete]
        [Route("column/{surveyTemplateColumnId:int}")]
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public void DeleteSurveyTemplateColumn(int surveyTemplateColumnId)
        {
            Repository.SurveyTemplateColumnDelete(surveyTemplateColumnId);
        }
    }
}
