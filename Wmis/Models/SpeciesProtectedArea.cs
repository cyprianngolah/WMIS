namespace Wmis.Models
{
	using Base;

    public class SpeciesProtectedArea : KeyedModel
	{
        public int SpeciesId { get; set; }
        
        public string Name { get; set; }
	}
}