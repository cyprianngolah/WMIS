namespace Wmis
{
	using System.Web.Http;
	using System.Web.Mvc;
	using System.Web.Optimization;
	using System.Web.Routing;
	using App_Start;
	using WebApi;

	using Wmis.Argos;
	using Wmis.Logic;

	/// <summary>
	/// Application Start
	/// </summary>
	public class MvcApplication : System.Web.HttpApplication
    {
		/// <summary>
		/// The Application Start
		/// </summary>
        protected void Application_Start()
		{
			var c = new Configuration.WebConfiguration();

			WebApi.ObjectFactory.Container.Configure(x =>
				{
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
    }
}
