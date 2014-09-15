using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Wmis.Controllers
{
    public class ReferenceController : Controller
    {
        // GET: Reference
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