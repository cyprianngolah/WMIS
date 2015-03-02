namespace Wmis.Dto
{
	public class ReferenceRequest : PagedDataRequest
	{
		public int? ReferenceKey { get; set; }

		public string Keywords { get; set; }
	}
}