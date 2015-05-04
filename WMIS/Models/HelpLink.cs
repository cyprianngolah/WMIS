namespace Wmis.Models
{
    public class HelpLink : Base.KeyedModel
    {
        public string Name { get; set; }

        public string TargetUrl { get; set; }

        public int Ordinal { get; set; }
    }
}