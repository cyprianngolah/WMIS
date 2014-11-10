namespace Wmis.Models
{
    using System;

    using Base;


    public class ArgosPass : KeyedModel
	{

        public int CollarId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public DateTime LocationDate { get; set; }

	}
}