namespace Wmis.Auth
{
	using System.Linq;
	using System.Security.Claims;

	public class WmisMvcAuthorizeAttribute : System.Web.Mvc.AuthorizeAttribute
	{
		protected override bool AuthorizeCore(System.Web.HttpContextBase httpContext)
		{
			var identity = ClaimsPrincipal.Current.Identities.First();
			var userRoleClaims = identity.FindAll(ClaimTypes.Role).Select(x=>x.Value);
			var attributeRoleClaims = Roles.Split(',').Select(r => r.Trim());

			var intersect = userRoleClaims.Intersect(attributeRoleClaims).Any();
			return identity.IsAuthenticated && intersect;
		}
	}
}