namespace Wmis.Dto
{
    using System.Collections.Generic;

    using Wmis.Models;

    public class PersonRequest : PagedDataRequest
	{
        public bool ProjectLeadsOnly { get; set; }

        public string Keywords { get; set; }

        public string RoleName { get; set; }

        public PersonRequest()
        {
            ProjectLeadsOnly = false;
        }
	}
}