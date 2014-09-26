namespace Wmis.Models
{
	/// <summary>
    /// Represents a Species Synonym
    /// </summary>
	public class SpeciesSynonym : Base.AuditedKeyedModel
    {
        /// <summary>
        /// Gets or sets the Species Id
        /// </summary>
        public int SpeciesId { get; set; }

        /// <summary>
        /// Gets or sets the Species Synonym Type Id
        /// </summary>
        public int SpeciesSynonymTypeId { get; set; }

        /// <summary>
        /// Gets or sets the Name
        /// </summary>
        public string Name { get; set; }
    }
}