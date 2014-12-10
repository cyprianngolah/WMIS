namespace Wmis.Models
{
    using System;
    using System.Collections.Generic;

    public class File : Base.KeyedModel
	{
		public string Name { get; set; }
        
        public string Path { get; set; }

	}
}