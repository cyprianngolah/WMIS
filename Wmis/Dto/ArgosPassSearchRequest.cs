namespace Wmis.Dto
{
	/// <summary>
	/// Search Parameters used when getting the list of Argos Passes
	/// </summary>
	public class ArgosPassSearchRequest : PagedDataRequest
	{
		public int CollaredAnimalId { get; set; }

        public int? StatusFilter { get; set; }

        public int? DaysFilter { get; set; }

        public bool? ShowGpsOnly { get; set; }
	}
}