namespace Wmis.Dto
{
    using System.Collections.Generic;

    public class SpeciesSynonymRequest
    {
        public int SpeciesId { get; set; }

        public Dictionary<int, IEnumerable<string>> SynonymsDictionary { get; set; }
    }
}