namespace Wmis.Controllers
{
	using System.Web.Http;

	/// <summary>
	/// Test API
	/// </summary>
	public class TestApiController : ApiController
	{
		/// <summary>
		/// Default Hello World
		/// </summary>
		/// <returns>A string of Hello World.</returns>
		[HttpGet]
		[Route("HelloWorld/")]
		public string GetHelloWorld()
		{
			return "Hello World";
		}
}
}
