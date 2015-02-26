namespace Wmis
{
	using System.Linq;
	using System.Security.Claims;
	using System.Web.Http;
	using System.Web.Mvc;
	using System.Web.Optimization;
	using System.Web.Routing;
	using App_Start;

	using StructureMap.Web.Pipeline;

	using WebApi;

	using Wmis.Argos;
	using Wmis.Auth;
	using Wmis.Logic;
	using Wmis.Models;

    /// <summary>
	/// Application Start
	/// </summary>
	public class MvcApplication : System.Web.HttpApplication
    {
		public override void Init()
		{
			base.Init();

			PostAuthenticateRequest += MvcApplication_PostAuthenticateRequest;
		}

		/// <summary>
		/// The Application Start
		/// </summary>
        protected void Application_Start()
		{
			var c = new Configuration.WebConfiguration();

			WebApi.ObjectFactory.Container.Configure(x =>
				{
					x.For<ClaimsIdentity>().LifecycleIs<HttpContextLifecycle>().Use(() => ClaimsPrincipal.Current.Identities.First());
					x.ForConcreteType<WmisUser>();

					x.ForConcreteType<Configuration.WebConfiguration>();
					x.ForConcreteType<Models.WmisRepository>();

					x.For<ArgosDataClient>()
						.Use<ArgosDataClient>()
						.Ctor<string>("username").Is(c.AppSettings["ArgosWebserviceUsername"])
						.Ctor<string>("password").Is(c.AppSettings["ArgosWebservicePassword"]);

					x.ForConcreteType<ArgosJobService>();
				});
			GlobalConfiguration.Configuration.DependencyResolver = new StructureMapDependencyResolver(WebApi.ObjectFactory.Container);

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

		#region Manage User Identity Here
		void MvcApplication_PostAuthenticateRequest(object sender, System.EventArgs e)
		{
			if (! Request.IsAuthenticated)
				return;

			var username = User.Identity.Name;
			var repo = WebApi.ObjectFactory.Container.GetInstance<Models.WmisRepository>();
			var person = repo.PersonGet(username);

			var identity = ClaimsPrincipal.Current.Identities.First();
            identity.AddClaim(new Claim(WmisClaimTypes.UserKey, person.Key.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.GivenName, person.Name));
            if (person.HasAdministratorProjectRole)
				identity.AddClaim(new Claim(ClaimTypes.Role, Role.ADMINISTRATOR_BIODIVERSITY_ROLE));
            if (person.HasAdministratorProjectRole)
				identity.AddClaim(new Claim(ClaimTypes.Role, Role.ADMINISTRATOR_PROJECTS_ROLE));
		}
		#endregion
	}
}
