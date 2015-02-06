namespace Wmis.Dto
{
	public class ProjectSurveyRequest : PagedDataRequest
	{
		public int ProjectKey { get; set; }

        public int? SurveyTypeKey { get; set; }

		public string Keywords { get; set; }
	}
}