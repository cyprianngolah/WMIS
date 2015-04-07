using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Models
{
    using Wmis.Models.Base;

    public class Site : KeyedModel
    {
        public int ProjectKey { get; set; }

        public string SiteNumber { get; set; }

        public string Name { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }
    }
}