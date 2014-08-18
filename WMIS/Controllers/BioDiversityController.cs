namespace Wmis.Controllers
{
	using System.Web.Mvc;

	/// <summary>
	/// UI Controller for BioDiversity
	/// </summary>
	public class BioDiversityController : Controller
    {
		/// <summary>
		/// Gets the BioDiversity Set Page
		/// </summary>
		/// <returns>The results</returns>
        public ActionResult Index()
        {
            return View();
        }

		/// <summary>
		/// Gets the New BioDiversity Page
		/// </summary>
		/// <returns>The New BioDiversity Page</returns>
		public ActionResult New()
	    {
		    return View();
	    }

		/// <summary>
		/// Gets the Edit BioDiversity Page
		/// </summary>
		/// <param name="key">The key for the BioDiversity Model to edit</param>
		/// <returns>The Edit BioDiversity Page</returns>
	    public ActionResult Edit(int key)
		{
			ViewBag.SpeciesCommonName = "Wood Bison";
		    return View();
	    }
    }
}