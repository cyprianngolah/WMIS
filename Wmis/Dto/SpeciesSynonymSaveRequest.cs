namespace Wmis.Dto
{
    using System.Collections.Generic;

    public class SpeciesSynonymSaveRequest
    {
        public int SpeciesId { get; set; }

        public int SpeciesSynonymTypeId { get; set; }

        public IEnumerable<string> Synonyms { get; set; }
    }
}