using System.Collections.Generic;

namespace Wmis.Dto
{
    public class ProjectUsersSaveRequest
    {
        public int Key { get; set; }

        public List<int> UserIds { get; set; }
    }
}