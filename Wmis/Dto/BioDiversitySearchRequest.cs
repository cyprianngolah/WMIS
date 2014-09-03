namespace Wmis.Dto
{
	/// <summary>
	/// Search Parameters used when getting the list of BioDiversity information
	/// </summary>
	public class BioDiversitySearchRequest : PagedDataRequest
	{
		public int? GroupKey { get; set; }

		public int? OrderKey { get; set; }

		public int? FamilyKey { get; set; }

		public string Keywords { get; set; }
	}
}