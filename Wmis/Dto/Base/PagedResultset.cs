namespace Wmis.Dto
{
	using System.Collections.Generic;

    /// <summary>
	/// A result set with one or more pages
	/// </summary>
	/// <typeparam name="T">The type of data returned in the result set</typeparam>
	public class PagedResultset<T>
	{
		/// <summary>
		/// Gets or sets the list of Results
		/// </summary>
		public List<T> Data { get; set; }

		/// <summary>
		/// Gets or sets the total number of results
		/// </summary>
		public long ResultCount { get; set; }

		/// <summary>
		/// Gets or sets the initial search request data
		/// </summary>
		public PagedDataRequest DataRequest { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="PagedResultset&lt;T&gt;" /> class.
		/// </summary>
		public PagedResultset()
		{
			Data = new List<T>();
		}
	}
}