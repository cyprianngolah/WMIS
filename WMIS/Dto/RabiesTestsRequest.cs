using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Dto
{
    public class RabiesTestsRequest : PagedDataRequest
    {
        public int? RabiesTestsKey { get; set; }

        public string year{ get; set; }

        public string species { get; set; }

        public string community { get; set; }

        public string testResult { get; set; }

        public string Keywords { get; set; }
    }
}


 