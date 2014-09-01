namespace Wmis.Dto
{
	public class TaxonomyRequest : PagedDataRequest
	{
		public int? TaxonomyKey { get; set; }

		public int? TaxonomyGroupKey { get; set; }

		public string Keywords { get; set; }
	}
}