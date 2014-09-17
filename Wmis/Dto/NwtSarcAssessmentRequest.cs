namespace Wmis.Dto
{
    public class NwtSarcAssessmentRequest : PagedDataRequest
	{
		public int? Key { get; set; }

		public string Keywords { get; set; }
	}
}