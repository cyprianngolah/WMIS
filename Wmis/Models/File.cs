namespace Wmis.Models
{
    public class File : Base.KeyedModel
	{
		public string Name { get; set; }
        
        public string Path { get; set; }
	}
}