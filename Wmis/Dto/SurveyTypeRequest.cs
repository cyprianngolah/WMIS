namespace Wmis.Dto
{
	public class SurveyTypeRequest : PagedDataRequest
	{
        public bool IncludeAllOption { get; set; }

        public string Keywords { get; set; }
	}
}