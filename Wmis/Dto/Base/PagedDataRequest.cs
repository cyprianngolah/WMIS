namespace Wmis.Dto
{
	using System.Runtime.Serialization;

	/// <summary>
	/// The sort direction
	/// </summary>
	public enum SortDirection
	{
		/// <summary>
		/// Ascending Sort
		/// </summary>
		Asc = 0,

		/// <summary>
		/// Descending Sort
		/// </summary>
		Desc = 1
	}

	/// <summary>
	/// Parameters used when getting paged data via the Rest API
	/// </summary>
	public class PagedDataRequest
	{
		/// <summary>
		/// Gets or sets the 0-Based Starting Row
		/// </summary>
		public int StartRow { get; set; }

		/// <summary>
		/// Gets or sets the number of results to return
		/// </summary>
		[DataMember(Name = "iTotalDisplayRecords")]
		public int RowCount { get; set; }

		/// <summary>
		/// Gets or sets the column the data was sorted by
		/// </summary>
		public string SortBy { get; set; }

		/// <summary>
		/// Gets or sets the direction the Column of data was sorted by
		/// </summary>
		public SortDirection SortDirection { get; set; }

		public PagedDataRequest()
		{
			StartRow = 0;
			RowCount = 25;
			SortDirection = SortDirection.Desc;
		}
	}
}