namespace Wmis.Models
{
    public class SurveyTemplateColumn : Base.KeyedModel
    {
        public int SurveyTemplateId { get; set; }

        public string Name { get; set; }

        public string JsName
        {
            get
            {
                return Name.Replace(" ", "").ToLower();
            }
        }

        public string Order { get; set; }

        public bool IsRequired { get; set; }

        public SurveyTemplateColumnType ColumnType { get; set; }
    }
}