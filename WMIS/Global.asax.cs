namespace Wmis
{
	using System.Web.Http;
	using System.Web.Mvc;
	using System.Web.Optimization;
	using System.Web.Routing;
	using Extensions;
	using StructureMap;

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
			ObjectFactory.Initialize(x =>
			{
				x.ForConcreteType<Configuration.WebConfiguration>();
				x.ForConcreteType<Models.WmisRepository>();
				//x.For<Configuration.IConfiguration>().Singleton().Use<Configuration.WebConfiguration>();
			});
			GlobalConfiguration.Configuration.DependencyResolver = new StructureMapDependencyResolver();

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
