﻿namespace Wmis.ApiControllers
{
	using System.Web.Http;

	using Wmis.Auth;
	using Wmis.Configuration;

	/// <summary>
	/// Bio Diversity API Controller
	/// </summary>
	[RoutePrefix("api/settings")]
	public class SettingsController : BaseApiController
	{
		private readonly WmisUser _user;

		public SettingsController(WebConfiguration config, WmisUser user)
			: base(config)
		{
			_user = user;
		}

		[HttpGet]
		[Route]
		public WebConfiguration Get()
		{
			return WebConfiguration;
		}

		[HttpGet]
		[Route("user")]
		//[WmisWebApiAuthorizeAttribute(Roles = "AdministratorBiodiversity")]
		public WmisUser GetUser()
		{
			return _user;
		}
    }
}
