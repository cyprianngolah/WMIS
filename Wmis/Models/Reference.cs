namespace Wmis.Models
{
	public class Reference :Base.KeyedModel
	{
		public string Code { get; set; }

		public string Author { get; set; }

		public int Year { get; set; }

		public string Title { get; set; }

		public string EditionPublicationOrganization { get; set; }

		public string VolumePage { get; set; }

		public string Publisher { get; set; }

		public string City { get; set; }

		public string Location { get; set; }
	}
}