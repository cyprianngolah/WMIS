namespace Wmis.Dto
{
	public class CosewicStatusRequest : PagedDataRequest
	{
		public int? Key { get; set; }

		public string Keywords { get; set; }
	}
}