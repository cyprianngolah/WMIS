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

	}
}