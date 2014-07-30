namespace Wmis.ApiControllers
{
	using System;
	using System.Web.Http;

	/// <summary>
	/// Bio Diversity API Controller
	/// </summary>
	[RoutePrefix("api")]
	public class BioDiversityController : ApiController
    {
		/// <summary>
		/// Gets the list of BioDiversity information based on the searchRequestParameters
		/// </summary>
		/// <param name="searchRequestParameters">The parameters used when searching for BioDiversity data</param>
		/// <returns>The paged data for BioDiversity</returns>
		[HttpGet]
		[Route("biodiversity/")]
		public Dto.PagedResultset<Models.BioDiversity> Get([FromUri]Dto.BioDiversitySearchRequest searchRequestParameters)
		{
			var results = new Dto.PagedResultset<Models.BioDiversity>
			{
				DataRequest = searchRequestParameters,
				ResultCount = 1
			};

			results.Data.Add(new Models.BioDiversity
			{
				Key = 1,
				Name = "Bison bison athabascae",
				CommonName = "Woods Bison",
				SubSpeciesName = "Bovinae",
				LastUpdated = DateTime.UtcNow.AddMinutes(-5012)
			});

			return results;
		}
    }
}
