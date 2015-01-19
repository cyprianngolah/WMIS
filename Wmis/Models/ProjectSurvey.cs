namespace Wmis.Models
{
	using System;

	using Base;

	using Newtonsoft.Json;

    public class ProjectSurvey : NullableKeyedModel
	{
		public int ProjectKey { get; set; }

		public BioDiversity TargetSpecies { get; set; }

		public SurveyType SurveyType { get; set; }

		public SurveyTemplate Template { get; set; }

		public string Description { get; set; }

		public string Method { get; set; }

		public string Results { get; set; }

		#region Aircraft/Crew
		public string AircraftType { get; set; }

		public string AircraftCallsign { get; set; }

		public string Pilot { get; set; }

		public string LeadSurveyor { get; set; }

		public string SurveyCrew { get; set; }

		public string ObserverExpertise { get; set; }

		public string AircraftCrewResults { get; set; }
		#endregion

		#region Weather
		public string CloudCover { get; set; }

		public string LightConditions { get; set; }

		public string SnowCover { get; set; }

		public string Temperature { get; set; }

		public string Precipitation { get; set; }

		public string WindSpeed { get; set; }

		public string WindDirection { get; set; }

		public string WeatherComments { get; set; }
		#endregion

		public int ObservationCount { get; set; }

		//[JsonConverter(typeof(ShortDateConverter))]
		public DateTime? StartDate { get; set; }

		public DateTime LastUpdated { get; set; }
	}
}