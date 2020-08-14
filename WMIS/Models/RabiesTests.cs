
namespace Wmis.Models
{
    using Base;
    using System;
    public class RabiesTests : KeyedModel
    {
        public DateTime? DateTested { get; set; }
        public string DataStatus { get; set; }
        public string Year { get; set; }
        public string SubmittingAgency { get; set; }
        public string LaboratoryIDNo { get; set; }
        public string TestResult { get; set; }
        public string Community { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int RegionId { get; set; }
        public string GeographicRegion { get; set; }
        public string Species { get; set; }
        public string AnimalContact { get; set; }
        public string HumanContact { get; set; }
        public string Comments { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}

