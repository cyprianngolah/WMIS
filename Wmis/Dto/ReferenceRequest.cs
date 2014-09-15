namespace Wmis.Dto
{
	public class ReferenceRequest : PagedDataRequest
	{
		public int? ReferenceKey { get; set; }

		public string SearchString { get; set; }
	}
}