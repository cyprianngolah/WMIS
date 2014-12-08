namespace Wmis.Models
{
    using System;
    using System.Globalization;

    using Base;

    using Newtonsoft.Json;

    public class ShortDateConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(DateTime);
        }

        public override object ReadJson(Newtonsoft.Json.JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            return DateTime.ParseExact((string)reader.Value, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        }

        public override void WriteJson(Newtonsoft.Json.JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
        {
            var d = (DateTime)value;
            writer.WriteValue(d.ToString("yyyy-MM-dd"));
        }
    }

    public class Collar : KeyedModel
	{
        public string CollarId { get; set; }
	    
        public string SubscriptionId { get; set; }
	    
        public string VhfFrequency { get; set; }

        public CollarType CollarType { get; set; }
	    
        public string JobNumber { get; set; }

        public string ProgramNumber { get; set; }

        public Boolean HasPttBeenReturned { get; set; }
	    
        public string Model { get; set; }

        public CollarStatus CollarStatus { get; set; }

        public CollarMalfunction CollarMalfunction { get; set; }
	    
        public CollarRegion CollarRegion { get; set; }

        public CollarState CollarState { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? InactiveDate { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? DeploymentDate { get; set; }
	    
        public string Size { get; set; }
	    
        public string BeltingColour { get; set; }
	    
        public string FirmwareVersion { get; set; }

        public string Comments { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? DropOffDate { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? EstimatedDropOff { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? EstimatedGpsFailure { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? EstimatedGpsBatteryEnd { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? EstimatedVhfFailure { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? EstimatedVhfBatteryEnd { get; set; }


        public int? EstimatedYearOfBirth { get; set; }
        
        public string EstimatedYearOfBirthBy { get; set; }

        public string EstimatedYearOfBirthMethod { get; set; }

        public DateTime LastUpdated { get; set; }

        public SimpleProject Project { get; set; }

        public Boolean? SignsOfPredation { get; set; }

        public Boolean? EvidenceOfChase { get; set; }

        public Boolean? SignsOfScavengers { get; set; }

        public Boolean? SnowSinceDeath { get; set; }

        public Boolean? SignsOfHumans { get; set; }

        public AnimalStatus AnimalStatus { get; set; }

        public AgeClass AgeClass { get; set; }

        public AnimalSex AnimalSex { get; set; }

        public int? AnimalId { get; set; }

        public AnimalMortality AnimalMortality { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? MortalityDate { get; set; }

        public ConfidenceLevel MortalityConfidence { get; set; }

        public double? MortalityLatitude { get; set; }

        public double? MortalityLongitude { get; set; }

        public string BodyCondition { get; set; }

        public string CarcassPosition { get; set; }

        public string CarcassComments { get; set; }

        public HerdPopulation HerdPopulation { get; set; }

		public ConfidenceLevel HerdAssociationConfidenceLevel { get; set; }

		public HerdAssociationMethod HerdAssociationMethod { get; set; }

		public BreedingStatus BreedingStatus { get; set; }

		public ConfidenceLevel BreedingStatusConfidenceLevel { get; set; }

        public BreedingStatusMethod BreedingStatusMethod { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? HerdAssociationDate { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? BreedingStatusDate { get; set; }

        public int? SpeciesId { get; set; }
	}
}