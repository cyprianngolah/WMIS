namespace Wmis.Auth
{
	using System.Collections.Generic;

	using Microsoft.Owin;

	public class HangfireAuthorizationFilter : Hangfire.Dashboard.IAuthorizationFilter
	{
		public bool Authorize(IDictionary<string, object> owinEnvironment)
		{
			var context = new OwinContext(owinEnvironment);

			return context.Authentication.User.Identity.IsAuthenticated;
		}
	}
}