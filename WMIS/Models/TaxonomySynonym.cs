using Wmis.Models.Base;

namespace Wmis.Models
{
    /// <summary>
    /// Represents a Taxonomy
    /// </summary>
    public class TaxonomySynonym : KeyedModel
    {
        /// <summary>
        /// Gets or sets the Taxonomy Id
        /// </summary>
        public int TaxonomyId { get; set; }

        /// <summary>
        /// Gets or sets the Name
        /// </summary>
        public string Name { get; set; }
    }
}