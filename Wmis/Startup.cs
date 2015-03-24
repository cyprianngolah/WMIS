[assembly: Microsoft.Owin.OwinStartup(typeof(Wmis.Startup))]

namespace Wmis
{
	using System;

	using Hangfire;
	using Hangfire.SqlServer;
	using Hangfire.StructureMap;
	using Owin;

	using Wmis.Auth;
	using Wmis.Logic;

	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			var container = WebApi.ObjectFactory.Container;
			var configuration = container.GetInstance<Wmis.Configuration.WebConfiguration>();

			app.UseHangfire(config =>
				{
					// Make the Container available to the Activated Jobs
					config.UseStructureMapActivator(container);

					config.UseAuthorizationFilters(new HangfireAuthorizationFilter());

					// Use Sql Server to store Job info
					config.UseSqlServerStorage(configuration.ConnectionStrings["WMIS"],  new SqlServerStorageOptions
					{
						// Don't automatically try to update the Storage Schema in Sql (cuz the WMIS connection string user doesn't have permission)
						PrepareSchemaIfNecessary = false,
						// Polling for new Jobs
						QueuePollInterval = TimeSpan.FromMinutes(5),
						// Once a Job is started, the amount of time it will remain "invisible" to agents before coming available again
						// Needs to be longer than the longest valid job, but not so long that it will not get run again if something hangs
						InvisibilityTimeout = TimeSpan.FromMinutes(60)
					});

					config.UseServer();
				});

			var jobService = container.GetInstance<ArgosJobService>();
			jobService.ScheduleArgos();
		}
	}
}
