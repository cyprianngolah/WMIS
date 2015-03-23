namespace Wmis.Models
{
    using Wmis.Models.Base;

    /// <summary>
    /// Model object for users in the Argos system
    /// </summary>
    public class ArgosUser : KeyedModel
    {
        /// <summary>
        /// Gets or sets the Argos Username
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the Argos Password
        /// </summary>
        public string Password { get; set; }
    }
}