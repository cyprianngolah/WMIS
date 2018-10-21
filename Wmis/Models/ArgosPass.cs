namespace Wmis.Models
{
    using System;

    using Base;

    public class ArgosPass : KeyedModel
	{
        public int CollaredAnimalId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public DateTime LocationDate { get; set; }

        public ArgosPassStatus ArgosPassStatus { get; set; }
        

        public string LocationClass { get; set; }

        public string CepRadius { get; set; }

        public string Comment { get; set; }

        public bool? ManualQA { get; set; }

        public bool? IsLastValidLocation { get; set; }
	}
}