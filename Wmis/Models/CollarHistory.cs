namespace Wmis.Models
{
    using System;

    public class CollarHistory: Base.KeyedModel
	{
        public int CollarId { get; set; }

        public string ActionTaken { get; set; }

        public string Comment { get; set; }

        public DateTime ChangeDate { get; set; }
	}
}