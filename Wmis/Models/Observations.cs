namespace Wmis.Models
{
	using System.Collections.Generic;

	public class Observations
	{
		public IEnumerable<SurveyTemplateColumn> Columns { get; set; }

		public dynamic ObservationData { get; set; }
	}
}