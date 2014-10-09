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
	}

	public class NullableKeyedModel
	{
		public int? Key { get; set; }
	}
}