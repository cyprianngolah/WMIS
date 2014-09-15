namespace Wmis.Dto
{
	public class StatusRankRequest : PagedDataRequest
	{
		public int? Key { get; set; }

		public string Keywords { get; set; }
	}
}