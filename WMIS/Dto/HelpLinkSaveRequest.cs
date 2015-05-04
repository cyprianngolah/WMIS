namespace Wmis.Dto
{
    public class HelpLinkSaveRequest
	{
        public int HelpLinkId { get; set; }

        public string Name { get; set; }

        public string TargetUrl { get; set; }

        public int Ordinal { get; set; }
	}
}