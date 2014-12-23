namespace Wmis.Models
{
	using Wmis.Models.Base;

	public class ObservationUploadStatus : KeyedModel
	{	
		public string Name { get; set; }

		public ObservationUploadStatus NextStep { get; set; }
	}
}