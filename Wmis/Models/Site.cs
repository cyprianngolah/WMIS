using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Models
{
    using Wmis.Models.Base;

    public class Site : KeyedModel
    {
        public string Name { get; set; }
    }
}