namespace Wmis.Controllers
{
	using System.Web.Mvc;

	public class EcoregionController : Controller
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
			ViewBag.Title = "Ecoregions";
            return View("_NotYetImplemented");
        }
	}
}