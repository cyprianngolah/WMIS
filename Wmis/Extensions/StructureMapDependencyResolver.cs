namespace Wmis.Extensions
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Web.Http.Dependencies;
	using StructureMap;

	/// <summary>
	/// Web Api Dependency Resolver for Structure Map
	/// Taken from solution at http://stackoverflow.com/questions/11889275/structuremap-and-asp-net-web-api-and-net-framework-4-5
	/// </summary>
	public class StructureMapDependencyResolver : IDependencyResolver
	{
		public void Dispose()
		{
		}

		public object GetService(Type serviceType)
		{
			if (serviceType.IsAbstract || serviceType.IsInterface)
			{
				return ObjectFactory.Container.TryGetInstance(serviceType);
			}

			return ObjectFactory.Container.GetInstance(serviceType);
		}

		public IEnumerable<object> GetServices(Type serviceType)
		{
			var instances = ObjectFactory.GetAllInstances(serviceType);

			return instances.Cast<object>().ToList();
		}

		public IDependencyScope BeginScope()
		{
			return this;
		}
	}
}