using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Dto
{
    public class WolfNecropsyRequest : PagedDataRequest
    {
        public int? necropsyId{ get; set; }

        public int? commonname { get; set; }

        public int? location { get; set; }

        public string Keywords { get; set; }
    }
}