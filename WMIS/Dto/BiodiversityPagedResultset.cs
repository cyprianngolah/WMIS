using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Dto
{
    using NPOI.SS.Formula.Functions;

    using Wmis.Models;

    public class BiodiversityPagedResultset : PagedResultset<BioDiversity>
    {
        public BiodiversitySearchFilters Filters { get; set; }
    }
}