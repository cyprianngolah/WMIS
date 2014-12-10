namespace Wmis.Dto
{
	public class FileSearchRequest : PagedDataKeyedKeywordRequest
	{
		public string Table { get; set; }
	}
}