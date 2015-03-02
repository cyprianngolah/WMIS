namespace Wmis.Models
{
	public class PersonProject : Base.KeyedModel
	{
		public int PersonKey { get; set; }

		public SimpleProject Project { get; set; }
	}
}