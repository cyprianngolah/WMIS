namespace Wmis.Auth
{
	using System.Linq;
	using System.Security.Claims;

	public class WmisWebApiAuthorizeAttribute : System.Web.Http.AuthorizeAttribute
	{
		protected override bool IsAuthorized(System.Web.Http.Controllers.HttpActionContext actionContext)
		{
			var identity = ClaimsPrincipal.Current.Identities.First();
			var userRoleClaims = identity.FindAll(ClaimTypes.Role).Select(x => x.Value);
			var attributeRoleClaims = Roles.Split(',').Select(r => r.Trim());

			var intersect = userRoleClaims.Intersect(attributeRoleClaims).Any();
			return identity.IsAuthenticated && intersect;
		}
	}
}