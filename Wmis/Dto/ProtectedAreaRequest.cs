namespace Wmis.Dto
{
	public class ProtectedAreaRequest : PagedDataRequest
	{
		public int? Key { get; set; }

		public string Keywords { get; set; }
	}
}