namespace Wmis.Dto
{
    public class HistoryLogSearchRequest : PagedDataKeyedKeywordRequest
    {
        public string Table { get; set; }

        public string Item { get; set; }

        public string ChangeBy { get; set; }
    }
}