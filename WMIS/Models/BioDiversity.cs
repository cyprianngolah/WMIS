namespace Wmis.Models
{
	/// <summary>
	/// Model object for BioDiversity
	/// </summary>
	public class BioDiversity : Base.AuditedKeyedModel
	{
		/// <summary>
		/// Gets or sets the Name value
		/// </summary>
		public string Name { get; set; }

		/// <summary>
		/// Gets or sets the Common Name
		/// </summary>
		public string CommonName { get; set; }

		/// <summary>
		/// Gets or sets the Sub Species Name
		/// </summary>
		public string SubSpeciesName { get; set; }
	}
}