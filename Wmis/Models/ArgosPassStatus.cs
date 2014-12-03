namespace Wmis.Models
{
    using System;

    public class ArgosPassStatus : Base.KeyedModel
	{
		public string Name { get; set; }

        public Boolean isRejected { get; set; }
	}
}