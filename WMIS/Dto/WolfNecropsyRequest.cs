using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Dto
{
    public class WolfNecropsyRequest : PagedDataRequest
    {
        public int? WolfNecropsyKey { get; set; }

        public string necropsyId { get; set; }

        public string commonName { get; set; }

        public string location { get; set; }

        public string Keywords { get; set; }
    }
}