namespace Wmis.Controllers
{
	using System.Web.Mvc;

	public class ProtectedAreaController : Controller
    {
        //
        // GET: /ProtectedArea/
        public ActionResult Index()
        {
			ViewBag.Title = "Protected Areas";
            return View("_NotYetImplemented");
        }
	}
}