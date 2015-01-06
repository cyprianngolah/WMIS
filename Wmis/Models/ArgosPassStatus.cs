namespace Wmis.Models
{
    public class ArgosPassStatus : Base.KeyedModel
	{
		public string Name { get; set; }

        public bool IsRejected { get; set; }
	}
}