namespace Wmis.Models
{
    using Base;

    /// <summary>
    /// Represents a Species
    /// </summary>
    public class SpeciesType : KeyedModel
    {
        /// <summary>
        /// Gets or sets the Species Name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the Species Common Name
        /// </summary>
        public string CommonName { get; set; }
    }
}