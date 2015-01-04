﻿namespace Wmis.Models
{
	public class SurveyTemplateColumn : Base.KeyedModel
	{
		public string Name { get; set; }

		public string Order { get; set; }

		public bool IsRequired { get; set; }

		public SurveyTemplateColumnType ColumnType { get;set; }
	}
}