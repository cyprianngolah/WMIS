using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Dto
{
    public class SiteSaveRequest
    {
        public int? Key { get; set; }

        public int ProjectKey { get; set; }

        public string SiteNumber { get; set; }

        public string Name { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public string Comments { get; set; }

        public DateTime? DateEstablished { get; set; }
        
        public string Reliability { get; set; }

        public string Map { get; set; }

        public string NearestCommunity { get; set; }

        public string Aspect { get; set; }

        public string CliffHeight { get; set; }

        public string NestHeight { get; set; }

        public string NestType { get; set; }

        public string InitialObserver { get; set; }

        public string Reference { get; set; }

        public string Habitat { get; set; }
    }
}