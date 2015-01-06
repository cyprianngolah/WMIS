namespace Wmis.Models
{
    using System.Collections.Generic;

    public class User : Base.KeyedModel
	{
		public string Username { get; set; }
        
        public string FirstName { get; set; }
        
        public string LastName { get; set; }

        public bool AdministratorProjects { get; set; }
        
        public bool AdministratorBiodiversity { get; set; }

        public List<SimpleProject> Projects { get; set; }
	}
}