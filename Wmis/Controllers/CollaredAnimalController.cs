namespace Wmis.Controllers
{
	using System.Web.Mvc;

	/// <summary>
	/// UI Controller for Collar
	/// </summary>
	public class CollaredAnimalController : Controller
    {
		/// <summary>
		/// Gets the Collar Set Page
		/// </summary>
		/// <returns>The results</returns>
        public ActionResult Index()
        {
            return View();
        }

		/// <summary>
		/// Gets the New Collar Page
		/// </summary>
		/// <returns>The New Collar Page</returns>
		public ActionResult New()
	    {
		    return View();
	    }

		/// <summary>
		/// Gets the Edit Collar Page
		/// </summary>
		/// <param name="key">The key for the Collar Model to edit</param>
		/// <returns>The Edit Collar Page</returns>
	    public ActionResult Edit(int key)
		{
			ViewBag.Key = key;
		    return View();
	    }
    }
}