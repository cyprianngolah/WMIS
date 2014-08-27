namespace Wmis.Controllers
{
	using System.Web.Mvc;

	public class TaxonomyController : Controller
	{
        public ActionResult Index()
        {
            return View();
        }

		public ActionResult New()
		{
			return View("Edit");
		}

		public ActionResult Edit(int key)
		{
			ViewBag.Key = key;
			return View();
		}
	}
}