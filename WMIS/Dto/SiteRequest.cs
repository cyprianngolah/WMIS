using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Dto
{
    public class SiteRequest : PagedDataRequest
    {
        public int? Key { get; set; }

        public string Keywords { get; set; }

        public int? ProjectKey { get; set; }
    }
}