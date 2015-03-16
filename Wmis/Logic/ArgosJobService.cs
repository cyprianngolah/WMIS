namespace Wmis.Logic
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Hangfire;

	using Wmis.Argos;
	using Wmis.Argos.Entities;
	using Wmis.Configuration;
	using Wmis.Models;

	public class ArgosJobService
	{
		#region Fields
		private readonly ArgosDataClient _argosDataClient;
		private readonly WmisRepository _repository;
		private readonly WebConfiguration _configuration;
		#endregion

		public ArgosJobService(ArgosDataClient argosDataClient, WmisRepository repository, WebConfiguration configuration)
		{
			_argosDataClient = argosDataClient;
			_repository = repository;
			_configuration = configuration;
		}

		public void ScheduleArgos()
		{
			if (_configuration.AppSettings.Keys.Any(k => k == "ArgosWebserviceScheduleCronExpression"))
			{
				if (_configuration.AppSettings.Keys.Any(k => k == "ArgosWebserviceScheduleCronExpression"))
				{
					var cronExpression = _configuration.AppSettings["ArgosWebserviceScheduleCronExpression"];
					if (string.IsNullOrEmpty(cronExpression))
					{
						RecurringJob.RemoveIfExists("TimeForArgosWebserviceToRun");
					}
					else
					{
						BackgroundJob.Enqueue(() => EnqueueActiveCollars());
						RecurringJob.AddOrUpdate("TimeForArgosWebserviceToRun", () => EnqueueActiveCollars(), cronExpression);
					}
				}
			}
		}

		public void EnqueueActiveCollars()
		{
			var collars = _repository.CollarGet(new Dto.CollarSearchRequest { ActiveOnly = true, StartRow = 0, RowCount = Int32.MaxValue });
			var legitCollars = collars.Data.Where(c => !string.IsNullOrEmpty(c.SubscriptionId.Trim()));

			foreach (var c in legitCollars)
			{
                if(!string.IsNullOrEmpty(c.SubscriptionId))
				    BackgroundJob.Enqueue(() => GetArgosDataForCollar(c.Key, c.SubscriptionId));
			}
		}

		[AutomaticRetry(Attempts=1, LogEvents=true)]
		public IEnumerable<ArgosSatellitePass> GetArgosDataForCollar(int collaredAnimalId, string subscriptionId)
		{
			var data = _argosDataClient.RetrieveArgosDataForCollar(subscriptionId);

			// Merge the Data into the databse
			if (data.Any())
				_repository.ArgosPassMerge(collaredAnimalId, data);

			return data;
		}
	}
}