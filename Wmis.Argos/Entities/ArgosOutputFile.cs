using System;
using System.Collections.Generic;

namespace Wmis.Argos.Entities
{
    /// <summary>
    /// Represents a processed .csv file loaded from the file system
    /// </summary>
    public class ArgosOutputFile
    {
        public string CTN { get; set; }
        public string ErrorMessage { get; set; }

        public List<ArgosOutputFileRow> Rows { get; private set; }

        public ArgosOutputFile()
        {
            Rows = new List<ArgosOutputFileRow>();
        }
    }

    /// <summary>
    /// Represents a row in the processed .csv file
    /// </summary>
    public class ArgosOutputFileRow
    {
        public DateTime? Timestamp { get; set; }
        public string Error { get; set; }

        public string LocationClass { get; set; }
        public double? ArgosLatitude { get; set; }
        public double? ArgosLongitude { get; set; }
        public double? ArgosAltitude { get; set; }

        public string GpsFixAttempt { get; set; }
        public double? GpsLatitude { get; set; }
        public double? GpsLongitude { get; set; }

        public double? Temperature { get; set; }
        public string Mortality { get; set; }
        public string LowVoltage { get; set; }

        public static string GPS_LOCATION_CLASS = "G";

        public string Combine
        {
            get
            {
                return string.Format("{0:yyyy-MM-dd-HH:mm:ss}={1}-{2}={3}-{4}", (Timestamp.HasValue ? Timestamp : DateTime.Now), ArgosLatitude ?? 0.0, ArgosLongitude ?? 0.0, GpsLatitude ?? 0.0, GpsLongitude ?? 0.0);
            }
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;
            if (!(obj is ArgosOutputFileRow))
                return false;

            var other = obj as ArgosOutputFileRow;

            return Combine.Equals(other.Combine);
        }

        public override int GetHashCode()
        {
            return Combine.GetHashCode();
        }
    }
}
