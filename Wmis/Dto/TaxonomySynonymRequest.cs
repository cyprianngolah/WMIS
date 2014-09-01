namespace Wmis.Dto
{
    using System.Collections.Generic;

    public class TaxonomySynonymRequest
    {
        public int TaxonomyId { get; set; }

        public IEnumerable<string> Synonyms { get; set; }
    }
}