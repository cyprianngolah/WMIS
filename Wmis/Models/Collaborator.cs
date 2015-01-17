namespace Wmis.Models
{
	public class Collaborator : Base.KeyedModel
	{
		public string Name { get; set; }

        public string Organization { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }
	}
}