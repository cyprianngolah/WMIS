using System;
using System.Collections.Generic;
namespace Wmis.Argos.Entities
{
    public class LotekOutputFile
    {
        public string CTN { get; set; }
        public string ErrorMessage { get; set; }

        public List<LotekOutputFileRow> Rows { get; private set; }

        public LotekOutputFile()
        {
            Rows = new List<LotekOutputFileRow>();
        }
    }


    /// <summary>
    /// Represents a row in the processed .csv file
    /// </summary>
    public class LotekOutputFileRow 
    {
        public string Error { get; set; }

        public string DeviceId { get; set; }
        public DateTime? TimestampGMT { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? Altitude { get; set; }
        public string FixStatus { get; set; }


        public string Combine
        {
            get
            {
                return string.Format("{0:yyyy-MM-dd-HH:mm:ss}={1}-{2}", (TimestampGMT.HasValue ? TimestampGMT : DateTime.Now), Latitude ?? 0.0, Longitude ?? 0.0);
            }
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;
            if (!(obj is LotekOutputFileRow))
                return false;

            var other = obj as LotekOutputFileRow;

            return Combine.Equals(other.Combine);
        }

        public override int GetHashCode()
        {
            return Combine.GetHashCode();
        }
    }
}
