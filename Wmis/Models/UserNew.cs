namespace Wmis.Models
{
    using System;

    public class UserNew
    {
        public string Username { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public Boolean AdministratorProjects { get; set; }

        public Boolean AdministratorBiodiversity { get; set; }
    }
}