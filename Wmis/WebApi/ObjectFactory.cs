namespace Wmis.WebApi
{
	using System;
	using System.Threading;
	using StructureMap;

	public static class ObjectFactory
	{
		private static readonly Lazy<Container> _containerBuilder = new Lazy<Container>(LazyThreadSafetyMode.ExecutionAndPublication);

		public static IContainer Container
		{
			get { return _containerBuilder.Value; }
		}
	}
}