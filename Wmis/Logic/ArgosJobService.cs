namespace Wmis.Logic
{
    using DotSpatial.Topology;
    using Hangfire;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Wmis.Argos;
    using Wmis.Argos.Entities;
    using Wmis.Configuration;
    using Wmis.Extensions;
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

            var badPassStatus = _repository.ArgosPassStatusGet(new Dto.PagedDataRequest()).Data.First(status => !status.IsRejected && status.Name.Contains("Error"));
            var kmPerHour = 30;

            foreach (var collar in legitCollars)
            {
                var passRows = _repository.ArgosPassGet(new Dto.ArgosPassSearchRequest { CollaredAnimalId = collar.Key, RowCount = 1000 }).Data.OrderBy(p => p.LocationDate);

                if (passRows.Count() > 0)
                {
                    Coordinate lastCoord = null;
                    DateTime lastLocationDate = passRows.First().LocationDate;

                    foreach (var pass in passRows)
                    {
                        if (pass.ArgosPassStatus.IsRejected)
                            continue;

                        var myCoord = new Coordinate(pass.Longitude, pass.Latitude);

                        if (lastCoord != null)
                        {
                            var distance = myCoord.KilometersTo(lastCoord);
                            var span = pass.LocationDate.Subtract(lastLocationDate);
                            var hours = span.TotalHours;
                            var tolerance = Math.Min((hours + 1) * kmPerHour, 100);

                            if (distance > tolerance)
                            {
                                var comment = pass.Comment;

                                if (string.IsNullOrEmpty(comment))
                                    comment += "Flagged during import: " + Math.Round(distance, 2) + " km traveled in " + FormatSpan(span);
                                else if (!comment.Contains("Flagged during import"))
                                    comment += Environment.NewLine + "Flagged during import: " + Math.Round(distance, 2) + " km traveled in " + FormatSpan(span);

                                _repository.ArgosPassUpdate(pass.Key, badPassStatus.Key, comment);
                            }
                        }

                        lastLocationDate = pass.LocationDate;
                        lastCoord = myCoord;
                    }
                }
            }

            return data;
        }

        private string FormatSpan(TimeSpan span)
        {
            if (span.TotalHours < 1)
                return string.Format("{0} minutes", span.Minutes);

            if (span.TotalDays < 1)
                return string.Format("{0} hour(s)", span.Hours);

            return string.Format("{0} days", Math.Round(span.TotalDays, 2));
        }
    }
}