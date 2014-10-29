namespace Wmis.Dto
{
	/// <summary>
	/// Search Parameters used when getting the list of Collar information
	/// </summary>
	public class CollarSearchRequest : PagedDataRequest
	{
		public string Keywords { get; set; }

		public int? regionKey { get; set; }
	}
}