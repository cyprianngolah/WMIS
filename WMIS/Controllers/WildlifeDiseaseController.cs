using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Wmis.Controllers
{
    public class WildlifeDiseaseController : Controller
    {
        // GET: WildlifeDisease
        public ActionResult WildlifeDiseaseIndex()
        {
            return View();
        }

        // GET: WolfNecropsyIndex
        public ActionResult WolfNecropsyIndex()
        {
            return View();
        }

        // GET: RabiesTestIndex
        public ActionResult RabiesTestIndex()
        {
            return View();
        }

    }
}