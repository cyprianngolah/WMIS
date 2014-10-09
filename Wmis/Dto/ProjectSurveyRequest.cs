namespace Wmis.Dto
{
	public class ProjectSurveyRequest : PagedDataRequest
	{
		public int ProjectKey { get; set; }

		public string Keywords { get; set; }
	}
}