namespace Wmis.Models
{
	using System.Collections.Generic;

	using Base;

	public class Person : KeyedModel
	{
		public List<Role> Roles { get; set; }

		public string Name { get; set; }

		public string Email { get; set; }

		public string JobTitle { get; set; }
	}
}