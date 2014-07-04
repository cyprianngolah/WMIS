namespace WMIS.Controllers
{
	using System.Web.Http;

	public class TestApiController : ApiController
	{
		[HttpGet]
		[Route("HelloWorld/")]
		public string GetHelloWorld()
		{
			return "Hello World";
		}
}
}
