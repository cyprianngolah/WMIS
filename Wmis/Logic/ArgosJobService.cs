namespace Wmis.Logic
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Hangfire;

    using NPOI.Util;

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
            var programs = _repository.ArgosProgramsGetAll(); //.Where(p => p.ArgosUser.Name  == "gunn");

            foreach (var program in programs)
            {
                BackgroundJob.Enqueue(() => GetArgosDataForProgram(program));
            }

            // This is the old code block that downloads a single collar at a time.
            /*        
		    var collars = _repository.CollarGet(new Dto.CollarSearchRequest { ActiveOnly = true, StartRow = 0, RowCount = Int32.MaxValue });
			var legitCollars = collars.Data.Where(c => !string.IsNullOrEmpty(c.SubscriptionId.Trim()));

			foreach (var c in legitCollars)
			{
                if(!string.IsNullOrEmpty(c.SubscriptionId))
				    BackgroundJob.Enqueue(() => GetArgosDataForCollar(c.Key, c.SubscriptionId));
			}
            */
        }

        [AutomaticRetry(Attempts = 1, LogEvents = true)]
        public IEnumerable<ArgosSatellitePass> GetArgosDataForCollar(ArgosProgram program, int collaredAnimalId, string subscriptionId)
        {
            if (program.ArgosUser == null || string.IsNullOrEmpty(program.ArgosUser.Name) || string.IsNullOrEmpty(program.ArgosUser.Password))
                return new List<ArgosSatellitePass>();

            var data = _argosDataClient.RetrieveArgosDataForCollar(subscriptionId, program.ArgosUser.Name, program.ArgosUser.Password);

            // Merge the Data into the databse
            if (data.Any())
                _repository.ArgosPassMerge(collaredAnimalId, data);

            return data;
        }

        [AutomaticRetry(Attempts = 1, LogEvents = true)]
        public IEnumerable<ArgosSatellitePass> GetArgosDataForProgram(ArgosProgram program)
        {
            if (program.ArgosUser == null || string.IsNullOrEmpty(program.ArgosUser.Name) || string.IsNullOrEmpty(program.ArgosUser.Password))
                return new List<ArgosSatellitePass>();

            var collars = _repository.CollarGet(new Dto.CollarSearchRequest { StartRow = 0, RowCount = Int32.MaxValue });
            var legitCollars = collars.Data.Where(c => !string.IsNullOrEmpty(c.SubscriptionId));

            var data = _argosDataClient.RetrieveArgosDataForProgram(program.ProgramNumber, program.ArgosUser.Name, program.ArgosUser.Password);

            foreach (var collar in legitCollars)
            {
                var passesForCollar = data.Where(d => (d.PlatformId + "") == collar.SubscriptionId);

                _repository.ArgosPassMerge(collar.Key, passesForCollar);
            }

            return data;
        }
    }
}