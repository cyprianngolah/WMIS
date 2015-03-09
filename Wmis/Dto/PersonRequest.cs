namespace Wmis.Dto
{
    using System.Collections.Generic;

    using Wmis.Models;

    public class PersonRequest : PagedDataRequest
	{
		public List<Role> Role { get; set; }
	}
}