namespace Wmis.Dto
{
    /// <summary>
	/// Search Parameters used when getting the list of Collar information
	/// </summary>
	public class CollarSearchRequest : PagedDataRequest
	{
		public string Keywords { get; set; }

		public int? RegionKey { get; set; }

        public int? SpeciesKey { get; set; }

        public bool NeedingReview { get; set; }

		public bool ActiveOnly { get; set; }

	    public CollarSearchRequest()
	    {
			ActiveOnly = false;
	    }
	}
}