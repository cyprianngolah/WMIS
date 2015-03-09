namespace Wmis.Models
{
	using Wmis.Models.Base;

	public class Role : KeyedModel
	{
	    public static readonly Role ADMINISTRATOR_BIODIVERSITY = new Role() { Name = ADMINISTRATOR_BIODIVERSITY_ROLE };

        public static readonly Role ADMINISTRATOR_PROJECTS = new Role() { Name = ADMINISTRATOR_PROJECTS_ROLE };

        public static readonly Role PROJECT_LEAD = new Role() { Name = PROJECT_LEAD_ROLE };

        public const string PROJECT_LEAD_ROLE = "Project Lead";

	    public const string ADMINISTRATOR_BIODIVERSITY_ROLE = "Administrator Biodiversity";

        public const string ADMINISTRATOR_PROJECTS_ROLE = "Administrator Projects";

		public string Name { get; set; }
	}
}