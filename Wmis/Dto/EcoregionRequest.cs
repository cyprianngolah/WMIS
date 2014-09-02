namespace Wmis.Dto
{
	public class EcoregionRequest : PagedDataRequest
	{
		public int? Key { get; set; }

		public string Keywords { get; set; }
	}
}