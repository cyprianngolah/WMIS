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
    }
}