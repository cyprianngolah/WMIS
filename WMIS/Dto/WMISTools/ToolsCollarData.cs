using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Dto.WMISTools
{
    public class ToolsCollarData
    {
        public string CTN { get; set; }
        public DateTime? Timestamp { get; set; }

        public double? GpsLatitude { get; set; }
        public double? GpsLongitude { get; set; }

        public string LocationClass { get; set; }

        public string Error { get; set; }

        public string GpsFixAttempt { get; set; }

        public double? Temperature { get; set; }
        public string Mortality { get; set; }

        public string PredeploymentData { get; set; }
    }

    public class ToolsLotekData
    {

        public string DeviceId { get; set; }
        public DateTime? LocationDate { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public string LocationClass { get; set; }

        //public double? Temperature { get; set; }

    }
}