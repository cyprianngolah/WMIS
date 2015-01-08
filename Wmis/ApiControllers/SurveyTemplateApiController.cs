namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Web.Http;

	using Wmis.Configuration;
    using Wmis.Dto;
    using Wmis.Models;
    using Wmis.Models.Base;

    [RoutePrefix("api/surveytemplate")]
	public class SurveyTemplateApiController : BaseApiController
    {
		public SurveyTemplateApiController(WebConfiguration config)
			: base(config)
		{
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
        public int Create([FromBody]SurveyTemplateSaveRequest request)
        {
            return Repository.SurveyTemplateSave(request, "Unknown User");
        }
        
        [HttpPost]
        [Route("column")]
        public int CreateColumn([FromBody]SurveyTemplateColumnSaveRequest request)
        {
            return Repository.SurveyTemplateColumnSave(request);
        }

        [HttpDelete]
        [Route("column/{surveyTemplateColumnId:int}")]
        public void DeleteSurveyTemplateColumn(int surveyTemplateColumnId)
        {
            Repository.SurveyTemplateColumnDelete(surveyTemplateColumnId);
        }
    }
}
