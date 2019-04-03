using System;
using System.Collections.Generic;

namespace Wmis.Dto.WMISTools
{
    public class ToolsLotekOutputFile
    {
        public string DeviceId { get; set; }
        public string ErrorMessage { get; set; }

        public List<ToolsLotekOutputFileRow> Rows { get; private set; }

        public ToolsLotekOutputFile()
        {
            Rows = new List<ToolsLotekOutputFileRow>();
        }
    }

    /// <summary>
    /// Represents a row in the processed .csv file
    /// </summary>
    public class ToolsLotekOutputFileRow
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
            if (!(obj is ToolsLotekOutputFileRow))
                return false;

            var other = obj as ToolsLotekOutputFileRow;

            return Combine.Equals(other.Combine);
        }

        public override int GetHashCode()
        {
            return Combine.GetHashCode();
        }
    }
}
