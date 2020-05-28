

namespace Wmis.Controllers
{
    using System.Linq;
    using System.Security.Claims;
    using System.Web.Mvc;
    using Wmis.Auth;
    using Wmis.Dto;
    using Wmis.Models;

    public class WolfNecropsy : Controller
    {
        // GET: WildlifeDisease
        public ActionResult WildlifeDiseaseIndex()
        {
            return View();
        }

        // GET: WolfNecropsyIndex
        public ActionResult Index()
        {
            return View();
        }

        // GET: RabiesTestIndex
        public ActionResult RabiesTestIndex()
        {
            return View();
        }

        // GET: Animal Necropsy
        public ActionResult AnimalNecropsyIndex()
        {
            return View();
        }

        // GET: New Necropsy
        public ActionResult NewNecropsyIndex()
        {
            return View();
        }
    }
}