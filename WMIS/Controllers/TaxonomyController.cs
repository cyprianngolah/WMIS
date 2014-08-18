namespace Wmis.Controllers
{
	using System.Web.Mvc;

	public class TaxonomyController : Controller
	{
        //
        // GET: /Taxonomy/
        public ActionResult Index()
        {
	        ViewBag.Title = "Taxonomies";
            return View();
        }
	}
}