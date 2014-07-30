namespace Wmis.Models.Base
{
	using System;

	/// <summary>
	/// A Model with a Key
	/// </summary>
	public class KeyedModel
	{
		/// <summary>
		/// Gets or sets the Model's Key
		/// </summary>
		public int Key { get; set; }

		/// <summary>
		/// Gets or sets the Last Updated timestamp
		/// </summary>
		public DateTime LastUpdated { get; set; }
	}
}