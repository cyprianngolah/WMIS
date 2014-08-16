namespace Wmis.Controllers
{
	using System.Web.Mvc;

	/// <summary>
	/// Default Controller
	/// </summary>
	public class HomeController : Controller
	{
		/// <summary>
		/// Default Method
		/// </summary>
		/// <returns>The Default View</returns>
		public ActionResult Index()
		{
			return View();
		}
	}
}