namespace Wmis.Controllers
{
	using System.Web.Mvc;

	public class ProjectController : Controller
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

		public ActionResult NewSurvey(int key)
		{
			ViewBag.ProjectKey = key;
			return View();
		}

		public ActionResult EditSurvey(int key)
		{
			ViewBag.Key = key;
			return View();
		}
    }
}