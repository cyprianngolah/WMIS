namespace Wmis.ApiControllers
{
	using System.Web.Http;

	using Wmis.Configuration;

	[RoutePrefix("api/surveytemplate")]
	public class SurveyTemplateController : BaseApiController
    {
		public SurveyTemplateController(WebConfiguration config)
			: base(config)
		{
		}

		[HttpGet]
		[Route]
		public Dto.PagedResultset<Models.SurveyTemplate> GetTemplates(Dto.SurveyTemplateRequest str)
		{
			return Repository.SurveyTemplateSearch(str ?? new Dto.SurveyTemplateRequest());
		}
    }
}
