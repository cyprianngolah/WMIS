namespace Wmis.Dto
{
    using Wmis.Models;

    public class SurveyTemplateColumnSaveRequest
	{
		public int? Key { get; set; }
		
        public int SurveyTemplateId { get; set; }

        public SurveyTemplateColumnType ColumnType { get; set; }

		public string Name { get; set; }

		public int Order { get; set; }
		
        public bool IsRequired { get; set; }
	}
}