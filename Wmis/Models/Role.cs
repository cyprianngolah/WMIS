namespace Wmis.Models
{
	using Wmis.Models.Base;

	public class Role : KeyedModel
	{
        public const string ADMINISTRATOR_BIODIVERSITY_ROLE = "AdministratorBiodiversity";

        public const string ADMINISTRATOR_PROJECTS_ROLE = "AdministratorProjects";

		public string Name { get; set; }

	    
	}
}