using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Models
{
    public class ReferenceYear : Base.KeyedModel
    {

        public ReferenceYear(int year)
        {
            this.Key = year;
            this.Name = year.ToString();
        }
        public string Name { get; set; }
    }
}