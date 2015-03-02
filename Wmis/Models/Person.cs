namespace Wmis.Models
{
	using System.Collections.Generic;

	using Base;

	public class Person : KeyedModel
	{
		public string Name { get; set; }

	    public string Username { get; set; }

		public string Email { get; set; }

		public string JobTitle { get; set; }

        public List<SimpleProject> Projects { get; set; }

		public List<Role> Roles { get; set; }

		public Person()
		{
			Projects = new List<SimpleProject>();
			Roles = new List<Role>();
		}
	}
}