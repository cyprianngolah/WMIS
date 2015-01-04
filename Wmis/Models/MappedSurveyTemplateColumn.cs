namespace Wmis.Models
{
	public class MappedSurveyTemplateColumn : Base.NullableKeyedModel
	{
		public int ObservationUploadKey { get; set; }

		public int? ColumnIndex { get; set; }

		public SurveyTemplateColumn SurveyTemplateColumn { get; set; }
	}
}