namespace Wmis.Models
{
    public class UserNew
    {
        public string Username { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public bool AdministratorProjects { get; set; }

        public bool AdministratorBiodiversity { get; set; }
    }
}