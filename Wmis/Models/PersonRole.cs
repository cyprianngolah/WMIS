namespace Wmis.Models
{
	public class PersonRole : Base.KeyedModel
	{
		public int PersonKey { get; set; }

		public Role Role { get; set; }
	}
}