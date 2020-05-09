

namespace Wmis.Controllers
{
    using System.Linq;
    using System.Security.Claims;
    using System.Web.Mvc;
    using Wmis.Auth;
    using Wmis.Dto;
    using Wmis.Models;

    public class WolfNecropsyController : Controller
    {
      
        // GET: Index
        public ActionResult Index()
        {
            return View();
        }

    }
}