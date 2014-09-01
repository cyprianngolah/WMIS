namespace Wmis.Dto
{
	public class TaxonomySaveRequest
	{
		public int? TaxonomyKey { get; set; }

		public int TaxonomyGroupKey { get; set; }

		public string Name { get; set; }
	}
}