namespace Wmis.Dto
{
	public class HistoryLogSearchRequest : PagedDataKeyedKeywordRequest
	{
		public string Table { get; set; }
	}
}