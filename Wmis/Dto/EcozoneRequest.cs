namespace Wmis.Dto
{
	public class EcozoneRequest : PagedDataRequest
	{
		public int? Key { get; set; }

		public string Keywords { get; set; }
	}
}