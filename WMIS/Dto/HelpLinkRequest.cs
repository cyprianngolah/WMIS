namespace Wmis.Dto
{
	public class HelpLinkRequest : PagedDataRequest
	{
		public int HelpLinkKey { get; set; }

		public string Keywords { get; set; }
	}
}