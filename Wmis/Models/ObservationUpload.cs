namespace Wmis.Models
{
	using System;

	using Wmis.Models.Base;

	public class ObservationUpload : KeyedModel
	{
		public int SurveyKey { get; set; }

		public string FilePath { get; set; }

		public string OriginalFileName { get; set; }

		public int? HeaderRowIndex { get; set; }

		public int? FirstDataRowIndex { get; set; }

		public ObservationUploadStatus Status { get; set; }

		public bool IsDeleted { get; set; }

		public DateTime UploadedTimestamp { get; set; }
	}
}