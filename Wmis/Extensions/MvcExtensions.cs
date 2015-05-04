namespace Wmis.Extensions
{
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