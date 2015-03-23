namespace Wmis.Argos.Entities
{
	using System;

	public class ArgosSatellitePass
	{
		public double Latitude { get; set; }

		public double Longitude { get; set; }

		public DateTime Timestamp { get; set; }

        public int PlatformId { get; set; }
	}
}
