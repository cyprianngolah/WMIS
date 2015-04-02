namespace Wmis.Auth
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Web.Mvc;

	public class WmisAuthorizeAttribute : AuthorizeAttribute
	{
		public string EnvironmentName { get; set; }

		public List<string> ApplicableEnvironments { get; set; }

		public List<string> SkipForUsers { get; set; }

		protected override bool AuthorizeCore(System.Web.HttpContextBase httpContext)
		{
			// Only do Authorization logic if this is an Applicable Environment and the current User isn't specified in the Skip list
			var currentUserName = httpContext.User.Identity.Name.ToLowerInvariant();
			if (ApplicableEnvironments.Any(ae => ae.Equals(EnvironmentName, StringComparison.OrdinalIgnoreCase) 
				|| SkipForUsers.Any(u=>u.ToLowerInvariant().Contains(currentUserName))))
			{
				return true;
			}

			return base.AuthorizeCore(httpContext);
		}
	}
}