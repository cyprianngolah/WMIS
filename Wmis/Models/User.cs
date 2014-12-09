namespace Wmis.Models
{
    using System;
    using System.Collections.Generic;

    public class User : Base.KeyedModel
	{
		public string Username { get; set; }
        
        public string FirstName { get; set; }
        
        public string LastName { get; set; }

        public Boolean AdministratorProjects { get; set; }
        
        public Boolean AdministratorBiodiversity { get; set; }

        public List<SimpleProject> Projects { get; set; }
	}
}