namespace Wmis.Extensions
{
	using System.Collections.Generic;
	using System.Linq;
	using System.Security.Claims;
	using System.Web.Mvc;

	public static class MvcSecurityExtension
	{
		public static bool UserHasRole(this HtmlHelper htmlHelper, string role)
		{
            //var identity = htmlHelper.ViewContext.HttpContext.User.Identity as ClaimsIdentity;
            //if (identity == null)
            //    return false;

            //var claims = identity.FindAll(ClaimTypes.Role) ?? new List<Claim>();
            //return claims.Any(c => c.Value.Equals(role, System.StringComparison.InvariantCultureIgnoreCase));
		    return true;
		}

		public static bool UserInAnyAdministratorRole(this HtmlHelper htmlHelper)
		{
			return UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorBiodiversity) || 
				UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorProjects) ||
                UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorCollaredAnimals);
		}

        // New role for only WMIS administrators
        public static bool UserIsWMISAdministrator(this HtmlHelper htmlHelper)
        {
            return UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorBiodiversity) & UserHasRole(htmlHelper, Auth.WmisRoles.WMISAdministrator) ||
                   UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorProjects) & UserHasRole(htmlHelper, Auth.WmisRoles.WMISAdministrator) ||
                   UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorCollaredAnimals) & UserHasRole(htmlHelper, Auth.WmisRoles.WMISAdministrator) ||
                   UserHasRole(htmlHelper, Auth.WmisRoles.AllRoles) & UserHasRole(htmlHelper, Auth.WmisRoles.WMISAdministrator) ||
                   UserHasRole(htmlHelper, Auth.WmisRoles.WMISAdministrator);
        }

        public static bool UserIsBiodiversityAdministrator(this HtmlHelper htmlHelper)
		{
			return UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorBiodiversity);
		}

		public static bool UserIsProjectCollarAdministrator(this HtmlHelper htmlHelper)
		{
			return UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorCollaredAnimals);
		}

        public static bool UserIsProjectAdministrator(this HtmlHelper htmlHelper)
        {
            return UserHasRole(htmlHelper, Auth.WmisRoles.AdministratorProjects);
        }

        public static bool UserIsWildlifeDiseaseAdministrator(this HtmlHelper htmlHelper)
        {
            return UserHasRole(htmlHelper, Auth.WmisRoles.WMISDiseaseAdministrator);
        }
    }
}