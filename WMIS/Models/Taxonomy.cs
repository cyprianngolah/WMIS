namespace Wmis.Models
{
	/// <summary>
	/// Represents a Taxonomy
	/// </summary>
	public class Taxonomy : Base.AuditedKeyedModel
	{
		/// <summary>
		/// Gets or sets the Taxonomy Group Id
		/// </summary>
		public int TaxonomyGroupId { get; set; }

		/// <summary>
		/// Gets or sets the Name
		/// </summary>
		public string Name { get; set; }
	}
}