namespace Wmis.WebApi
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Web.Http.Dependencies;
	using StructureMap;

	/// <summary>
	/// Web API Dependency Resolver for Structure Map
	/// Taken from solution at url
	/// </summary>
    /// <see href="http://stackoverflow.com/questions/11889275/structuremap-and-asp-net-web-api-and-net-framework-4-5"/>
	public class StructureMapDependencyResolver : IDependencyResolver
	{
		private readonly IContainer _container;

		public StructureMapDependencyResolver(IContainer container)
		{
			_container = container;
		}

		public void Dispose()
		{
		}

		public object GetService(Type serviceType)
		{
			if (serviceType.IsAbstract || serviceType.IsInterface)
			{
				return _container.TryGetInstance(serviceType);
			}

			return _container.GetInstance(serviceType);
		}

		public IEnumerable<object> GetServices(Type serviceType)
		{
			var instances = _container.GetAllInstances(serviceType);

			return instances.Cast<object>().ToList();
		}

		public IDependencyScope BeginScope()
		{
			return this;
		}
	}
}