namespace Wmis.Models
{
    using System;

    using Base;

	public class SurveyTemplate : KeyedModel
	{
		public string Name { get; set; }

        public DateTime DateCreated { get; set; }

        public int ProjectCount { get; set; }

        public string CreatedBy { get; set; }
	}
}