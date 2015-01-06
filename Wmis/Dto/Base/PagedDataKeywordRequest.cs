namespace Wmis.Dto
{
	/// <summary>
	/// Parameters used when getting paged data with keywords via the Rest API
	/// </summary>
	public class PagedDataKeywordRequest : PagedDataRequest
	{
        public string Keywords { get; set; }
	}
}