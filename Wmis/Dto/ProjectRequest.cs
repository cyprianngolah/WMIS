namespace Wmis.Dto
{
	public class ProjectRequest : PagedDataRequest
	{
		public int? ProjectLead { get; set; }

		public int? ProjectStatus { get; set; }

		public int? Region { get; set; }

		public string Keywords { get; set; }
	}
}