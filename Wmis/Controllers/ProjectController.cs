namespace Wmis.Controllers
{
    using System.Linq;
    using System.Security.Claims;
    using System.Web.Mvc;
    using Wmis.Auth;
    using Wmis.Dto;
    using Wmis.Models;

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
            ViewBag.CanViewSensitive = UserCanViewSenstiveInfoForProject(key);

            return View();
        }

        public ActionResult NewSurvey(int key)
        {
            ViewBag.ProjectKey = key;
            ViewBag.CanViewSensitive = UserCanViewSenstiveInfoForProject(key);

            return View();
        }

        public ActionResult EditSurvey(int key)
        {
            ViewBag.Key = key;
            ViewBag.CanViewSensitive = UserCanViewSenstiveInfoForProject(key);

            return View();
        }

        public ActionResult NewSite(int key)
        {
            ViewBag.Key = key;

            return View();
        }

        public ActionResult EditSite(int key)
        {
            ViewBag.Key = key;

            return View();
        }

        /// <summary>
        /// Determines whether the user can see the sensitive information for a project (if it has sensitive data)
        /// </summary>
        /// <param name="projectKey">The project in question</param>
        /// <returns>Whether or not it should be visible</returns>
        private bool UserCanViewSenstiveInfoForProject(int projectKey)
        {
            var username = User.Identity.Name;
            var repo = WebApi.ObjectFactory.Container.GetInstance<Models.WmisRepository>();
            var person = repo.PersonGet(username);

            // All administrators can see the sensitive data
            if (person.Roles.Select(r => r.Name).Contains(WmisRoles.AdministratorProjects))
                return true;
            else // if they created the project, they can see sensitve data
            {
                var historyItemForCreator = repo.HistoryLogSearch(new HistoryLogSearchRequest { Item = "Project Created", ChangeBy = username, Key = projectKey, Table = "ProjectHistory" }).Data;

                if (historyItemForCreator.Count() > 0)
                    return true;
            }

            return false;
        }
    }
}