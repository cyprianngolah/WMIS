namespace Wmis.Dto
{
    using System.Collections.Generic;

    public class TaxonomySaveRequest
	{
		public int? TaxonomyKey { get; set; }

		public int TaxonomyGroupKey { get; set; }

		public string Name { get; set; }

        public IEnumerable<string> Synonyms { get; set; }
	}
}