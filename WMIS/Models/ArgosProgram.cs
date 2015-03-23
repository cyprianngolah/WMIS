namespace Wmis.Models
{
    using Wmis.Models.Base;
    
    /// <summary>
    /// Model object for Programs in the Argos system
    /// </summary>
    public class ArgosProgram : KeyedModel
    {
        /// <summary>
        /// Gets or sets the Argos Program Number 
        /// </summary>
        public string ProgramNumber { get; set; }

        /// <summary>
        /// Gets or sets the Argos User associated with this Program
        /// </summary>
        public ArgosUser ArgosUser { get; set; }
    }
}