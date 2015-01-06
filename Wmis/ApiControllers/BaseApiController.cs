namespace Wmis.ApiControllers
{
	using System.Web.Http;
	using Models;

	public class BaseApiController : ApiController
	{
		/// <summary>
		/// Gets or sets the environment WebConfiguration
		/// </summary>
		public Configuration.WebConfiguration WebConfiguration { get; set; }

		public BaseApiController(Configuration.WebConfiguration configuration)
		{
			WebConfiguration = configuration;

			Repository = new WmisRepository(configuration);
		}

        /// <summary>
        /// Gets or sets the WMIS Repository
        /// </summary>
        protected WmisRepository Repository { get; set; }
	}
}