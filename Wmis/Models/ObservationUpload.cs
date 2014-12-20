namespace Wmis.Models
{
	using Wmis.Models.Base;

	public class ObservationUpload : KeyedModel
	{
		public int ProjectKey { get; set; }

		public string FilePath { get; set; }

		public int? HeaderRowIndex { get; set; }

		public int? FirstDataRowIndex { get; set; }

		public ObservationUploadStatus Status { get; set; }

		public bool IsDeleted { get; set; }
	}
}