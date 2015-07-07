namespace Wmis.Logic
{
    using DotSpatial.Topology;
    using Hangfire;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net.NetworkInformation;
    using Wmis.Argos;
    using Wmis.Argos.Entities;
    using Wmis.Configuration;
    using Wmis.Dto;
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
                        BackgroundJob.Enqueue(() => LoadArgosProcessedFiles());


                        //BackgroundJob.Enqueue(() => this.ProcessArgosCollars());
                        RecurringJob.AddOrUpdate("TimeForArgosWebserviceToRun", () => this.ProcessArgosCollars(), cronExpression);
                    }
                }
            }
        }

        public void ProcessArgosCollars()
        {
            var collarsFolder = _configuration.AppSettings["ProcessedArgosCollarsDirectory"];
            var server = collarsFolder.Split(';');
           
            PingReply respoPingReply = new Ping().Send(server[0], 1000);
            if (respoPingReply != null && respoPingReply.Status == IPStatus.Success)
            {
                var folder = @"\\" + server[0];
                folder = Path.Combine(folder, server[1]);
                if (Directory.Exists(folder))
                {
                    string[] files = Directory.GetFiles(folder);
                    //TODO: Parse files and pass through converter
                    return;
                }
            }
            throw new Exception("Can't access Argos Processed Files Folder: " + collarsFolder);

            /* Old Code that Read Directly from the Argos Service into the DB */
            //var programs = _repository.ArgosProgramsGetAll(); //.Where(p => p.ArgosUser.Name  == "gunn");

            //foreach (var program in programs)
            //{
            //    BackgroundJob.Enqueue(() => GetArgosDataForProgram(program));
            //}
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


        [AutomaticRetry(Attempts = 1, LogEvents = true)]
        public void LoadArgosProcessedFiles()
        {
            var collarConfig = _configuration.AppSettings["ProcessedArgosCollarsDirectory"];

            var collarConfigParts = collarConfig.Split(';');
            var folder = @"\\" + Path.Combine(collarConfigParts[0], collarConfigParts[1]);

            var reader = new ArgosFileReader(folder);

            var files = reader.ReadFiles();
            
            var goodOnes = files.Where(f => string.IsNullOrEmpty(f.ErrorMessage));
            var badOnes = files.Where(f => !string.IsNullOrEmpty(f.ErrorMessage));

            var output = "";

            foreach (var bad in badOnes)
            {
                output += bad.ErrorMessage + "<br/>";
            }

            // run good files through row parsing (business rules)

            var invalidLocClass = new List<string> { "0", "1", "2", "3", "4", null, "" };

            var passes = new List<ArgosPass>();

            foreach (var good in goodOnes)
            {
                var collar = _repository.CollarGet(new CollarSearchRequest { Keywords = good.CTN }).Data.FirstOrDefault();

                if (collar == null)
                    continue;

                foreach (var row in good.Rows)
                {
                    if (!string.IsNullOrEmpty(row.Error))
                        continue;

                    if (!row.Timestamp.HasValue)
                        continue;

                    var p = new ArgosPass { CollaredAnimalId = collar.Key, LocationDate = row.Timestamp.Value };

                    if (row.GpsFixAttempt == "Succeeded")
                    {
                        if (!row.GpsLatitude.HasValue || !row.GpsLongitude.HasValue)
                            continue;

                        if (row.GpsLatitude.Value < 0 || row.GpsLatitude.Value > 90 || row.GpsLongitude.Value < -180 || row.GpsLongitude.Value > 0)
                            continue;

                        p.Latitude = row.GpsLatitude.Value;
                        p.Longitude = row.GpsLongitude.Value;
                    }
                    else if (!invalidLocClass.Contains(row.LocationClass))
                    {
                        if (!row.ArgosLatitude.HasValue || !row.ArgosLongitude.HasValue)
                            continue;

                        if (row.ArgosLatitude.Value < 0 || row.ArgosLatitude.Value > 90 || row.ArgosLongitude.Value < -180 || row.ArgosLongitude.Value > 0)
                            continue;

                        p.Latitude = row.ArgosLatitude.Value;
                        p.Longitude = row.ArgosLongitude.Value;
                    }

                    passes.Add(p);
                }
            }

            var outputinfo = " Successfully read " + goodOnes.Count() + " files, " + badOnes.Count() + " had errors which created " + passes.Count() + " pass records for " + passes.Select(p => p.CollaredAnimalId).Distinct().Count() + " collars from " + goodOnes.SelectMany(g => g.Rows).Count() + " total rows";
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