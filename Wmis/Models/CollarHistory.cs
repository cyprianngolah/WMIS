namespace Wmis.Models
{
    using System;

    public class CollarHistory: Base.KeyedModel
	{
        public int CollaredAnimalId { get; set; }

        public string Item { get; set; }

        public string Value { get; set; }

        public string ChangeBy { get; set; }

        public DateTime ChangeDate { get; set; }

        public string Comment { get; set; }
	}
}