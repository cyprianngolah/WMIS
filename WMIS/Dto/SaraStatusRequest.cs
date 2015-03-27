namespace Wmis.Dto
{
	public class SaraStatusRequest : PagedDataRequest
	{
		public int? Key { get; set; }

		public string Keywords { get; set; }
	}
}