using System;
using System.Collections.Generic;


namespace Wmis.Dto.WMISTools
{
    /// <summary>
    /// Represents a processed .csv file loaded from the file system
    /// </summary>
    public class ToolsTelonicsOutputFile
    {
        public string CTN { get; set; }
        public string DataSource { get; set; }

        public int HeadersRow { get; set; }

        public string ErrorMessage { get; set; }

        public List<ToolsTelonicsOutputFileRow> Rows { get; private set; }

        public ToolsTelonicsOutputFile()
        {
            Rows = new List<ToolsTelonicsOutputFileRow>();
        }
    }

    public interface ToolsTelonicsOutputFileRow
    {
        DateTime? Timestamp { get; set; }
        string Error { get; set; }

        string GpsFixAttempt { get; set; }
        double? GpsLatitude { get; set; }
        double? GpsLongitude { get; set; }

        string PredeploymentData { get; set; }
        double? Temperature { get; set; }
        string Mortality { get; set; }
        string LowVoltage { get; set; }
        int? RepititionCount { get; set; }
    }
    public class IridiumAndArgosOutputFileRow : ToolsTelonicsOutputFileRow
    {
        public DateTime? Timestamp { get; set; }
        public string Error { get; set; }

        public string IridiumCepRadius { get; set; }
        public double? IridiumLatitude { get; set; }
        public double? IridiumLongitude { get; set; }

        public string GpsFixAttempt { get; set; }
        public double? GpsLatitude { get; set; }
        public double? GpsLongitude { get; set; }

        public double? Temperature { get; set; }
        public string Mortality { get; set; }
        public string LowVoltage { get; set; }
        public int? RepititionCount { get; set; }

        public string PredeploymentData { get; set; }

        public string Combine
        {
            get
            {
                return string.Format("{0:yyyy-MM-dd-HH:mm:ss}={1}-{2}={3}-{4}", (Timestamp.HasValue ? Timestamp : DateTime.Now), IridiumLatitude ?? 0.0, IridiumLongitude ?? 0.0, GpsLatitude ?? 0.0, GpsLongitude ?? 0.0);
            }
        }

    }
}