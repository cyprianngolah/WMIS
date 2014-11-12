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
        public string Name { get; set; }
	    
        public string SubscriptionId { get; set; }
	    
        public string VhfFrequency { get; set; }

        public CollarType CollarType { get; set; }
	    
        public string JobNumber { get; set; }
	    
        public string Model { get; set; }

        public CollarStatus CollarStatus { get; set; }

        public CollarMalfunction CollarMalfunction { get; set; }
	    
        public CollarRegion CollarRegion { get; set; }

        public CollarState CollarState { get; set; }

        [JsonConverter(typeof(ShortDateConverter))]
        public DateTime? InactiveDate { get; set; }
	    
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

        public DateTime LastUpdated { get; set; }

        public SimpleProject Project { get; set; }

	}
}