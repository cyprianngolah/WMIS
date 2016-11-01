using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Dto
{
    public class HistoricFilterTypeRequest : PagedDataRequest
    {
        public int ParentTableKey { get; set; }

        public string ParentTableName { get; set; }

        public int? CollaredAnimalId
        {
            get
            {
                return ParentTableName == "CollaredAnimals" ? ParentTableKey : (int?)null;
            }

        }

        public int? SpeciesId
        {
            get
            {
                return ParentTableName == "Biodiversity" ? ParentTableKey : (int?)null;
            }
            
        }

        public int? ProjectId
        {
            get
            {
                return ParentTableName == "ProjectHistory" ? ParentTableKey : (int?)null;
            }

        }

    }
}