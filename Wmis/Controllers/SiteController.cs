namespace Wmis.Controllers
{
    using System.Web.Mvc;

    public class SiteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View();
        }

        public ActionResult Edit(int key)
        {
            ViewBag.Key = key;
            return View();
        }
    }
}
