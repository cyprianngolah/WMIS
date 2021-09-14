namespace Wmis.Extensions
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Mvc.Html;
    using Wmis.Configuration;
    using Wmis.Models;

    /// <summary>
    /// Extension Methods used for MVC Razor Pages
    /// </summary>
    public static class MvcExtensions
    {
        /// <summary>
        /// Creates Bootstrap Navigation Menu lists and sets them as active based on current route data
        /// </summary>
        /// <param name="htmlHelper">The Helper</param>
        /// <param name="linkText">The link text</param>
        /// <param name="actionName">The action name</param>
        /// <param name="controllerName">The controller name</param>
        /// <returns>MVC Html String with the necessary Bootstrap Navigation Menu attributes</returns>
        public static MvcHtmlString MenuLink(this HtmlHelper htmlHelper, string linkText, string actionName, string controllerName)
        {
            var currentAction = htmlHelper.ViewContext.RouteData.GetRequiredString("action");
            var currentController = htmlHelper.ViewContext.RouteData.GetRequiredString("controller");

            var builder = new TagBuilder("li")
            {
                InnerHtml = htmlHelper.ActionLink(linkText, actionName, controllerName).ToHtmlString()
            };

            if (controllerName == currentController && actionName == currentAction)
            {
                builder.AddCssClass("active");
            }

            return new MvcHtmlString(builder.ToString());
        }

        /// <summary>
        /// Creates Bootstrap Navigation Menu lists and sets them as active based on current route data
        /// </summary>
        /// <param name="htmlHelper">The Helper</param>
        /// <param name="linkText">The link text</param>
        /// <param name="actionName">The action name</param>
        /// <param name="controllerName">The controller name</param>
        /// <returns>MVC Html String with the necessary Bootstrap Navigation Menu attributes</returns>
        public static MvcHtmlString MenuItem(this HtmlHelper htmlHelper, string linkText, string actionName, string controllerName, bool isDropdown=false)
        {
            var currentAction = htmlHelper.ViewContext.RouteData.GetRequiredString("action");
            var currentController = htmlHelper.ViewContext.RouteData.GetRequiredString("controller");

            
            var activeClass = isDropdown ? "dropdown-item" : "nav-link";


            //if (controllerName == currentController && actionName == currentAction)
            if (controllerName == currentController )
            {
                activeClass += " active";
            }

            var anchorLink = htmlHelper.ActionLink(linkText, actionName, controllerName, null, new { @class = activeClass }).ToHtmlString();

            var builder = new TagBuilder("li")
            {
                InnerHtml = anchorLink
            };

            if (isDropdown == false)
            {
                builder.AddCssClass("nav-item");
            }
                    
            return new MvcHtmlString(builder.ToString());

            
        }


        public static string getDropdownClass(this HtmlHelper htmlHelper, string controllerNames )
        {
            var activeController = "";
            var routeValues = HttpContext.Current.Request.RequestContext.RouteData.Values;
            if (routeValues.ContainsKey("controller")) {
                activeController = (string)routeValues["controller"];
            }

            var baseClass = "nav-link dropdown-toggle";

            IEnumerable<string> acceptedControllers = controllerNames.ToLower().Split(',').ToList();

            if (acceptedControllers.Contains(activeController.ToLower()))
            {
                baseClass += " active";
            }

            return baseClass;
        }

        public static MvcHtmlString HelpLinks(this HtmlHelper htmlHelper)
        {
            var config = DependencyResolver.Current.GetService<WebConfiguration>();
            var repo = new WmisRepository(config);
            var helpLinks = repo.HelpLinkSearch(new Dto.HelpLinkRequest()).Data;

            var outString = "";

            foreach (var link in helpLinks)
            {
                var anchor = new TagBuilder("a")
                {
                    InnerHtml = link.Name
                };

                anchor.Attributes.Add("href", link.TargetUrl);
                anchor.Attributes.Add("target", "_blank");

                var builder = new TagBuilder("li")
                {
                    InnerHtml = anchor.ToString()
                };


                outString += builder.ToString();
            }

            return new MvcHtmlString(outString);
        }
    }
}