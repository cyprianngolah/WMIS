namespace Wmis.Dto
{
	/// <summary>
	/// Search Parameters used when getting the list of Argos Passes
	/// </summary>
	public class ArgosPassSearchRequest : PagedDataRequest
	{
		public int CollarId { get; set; }
	}
}