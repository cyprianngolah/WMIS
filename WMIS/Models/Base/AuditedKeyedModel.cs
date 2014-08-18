namespace Wmis.Models.Base
{
	using System;

	public class AuditedKeyedModel : KeyedModel
	{
		/// <summary>
		/// Gets or sets the Last Updated timestamp
		/// </summary>
		public DateTime LastUpdated { get; set; } 
	}
}