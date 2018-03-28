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
                        BackgroundJob.Enqueue(() => ProcessCollarFiles());
                        RecurringJob.AddOrUpdate("TimeForCollarLoadToRun", () => this.ProcessCollarFiles(), cronExpression);
                    }
                }
            }
        }

        [AutomaticRetry(Attempts = 1, LogEvents = true)]
        public void ProcessCollarFiles()
        {
            //this.LoadLotekProcessedFiles();
            this.LoadArgosProcessedFiles();

        }

        public void ProcessArgosCollars()
        {
            var collarsFolder = _configuration.AppSettings["processedArgosCollarsDirectory"];
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

        public void LoadLotekProcessedFiles()
        {
            var collarConfig = _configuration.AppSettings["processedLotekCollarsDirectory"];

            if (string.IsNullOrEmpty(collarConfig))
                throw new ArgumentNullException("processedLotekCollarsDirectory");

            var collarConfigParts = collarConfig.Split(';');

            if (collarConfigParts.Length != 2 || string.IsNullOrEmpty(collarConfigParts[0]) || string.IsNullOrEmpty(collarConfigParts[1]))
                throw new ArgumentOutOfRangeException("processedLotekCollarsDirectory");
            var folder = @"\\" + Path.Combine(collarConfigParts[0], collarConfigParts[1]);

            var reader = new LotekFileReader(folder);
            var files = reader.ReadFiles();

            var noErrorFiles = files.Where(f => string.IsNullOrEmpty(f.ErrorMessage));

            foreach (var file in noErrorFiles)
            {
                var collerId = file.Rows.First().DeviceId;
                var collar = _repository.CollarGet(new CollarSearchRequest { Keywords = collerId }).Data.FirstOrDefault(c => c.CollarId == collerId);

                if (collar == null)
                    continue;

                var passes = new List<ArgosSatellitePass>();
               

                foreach (var row in file.Rows.Where(r => string.IsNullOrEmpty(r.Error) && r.TimestampGMT.HasValue && r.TimestampGMT <= DateTime.Now && r.TimestampGMT > DateTime.MinValue))
                {

                    if (row.Latitude.HasValue && row.Longitude.HasValue)
                    {
                        var p = new ArgosSatellitePass { Timestamp = row.TimestampGMT.Value };
                        p.Latitude = row.Latitude.Value;
                        p.Longitude = row.Longitude.Value;
                        p.LocationClass = ArgosOutputFileRow.GPS_LOCATION_CLASS;
                        passes.Add(p);
                    }
                }
                throw new ArgumentException("SAVING the following Collar ID: " +collar.Key +" with the following number of passes: "+ passes.Count);
                //_repository.ArgosPassMerge(collar.Key, passes);
            }
        }

        public void LoadArgosProcessedFiles()
        {
            var collarConfig = _configuration.AppSettings["processedArgosCollarsDirectory"];

            if (string.IsNullOrEmpty(collarConfig))
                throw new ArgumentNullException("ProcessedArgosCollarsDirectory");

            var collarConfigParts = collarConfig.Split(';');

            if (collarConfigParts.Length != 2 || string.IsNullOrEmpty(collarConfigParts[0]) || string.IsNullOrEmpty(collarConfigParts[1]))
                throw new ArgumentOutOfRangeException("ProcessedArgosCollarsDirectory");

            var folder = @"\\" + Path.Combine(collarConfigParts[0], collarConfigParts[1]);
            var reader = new TelonicsFileReader(folder);
            var files = reader.ReadFiles();

            var noErrorFiles = files.Where(f => string.IsNullOrEmpty(f.ErrorMessage));

            var validLocClasses = new List<string> { "0", "1", "2", "3"};
            var locatedCollars = new List<Collar>();

            foreach (var file in noErrorFiles)
            {
                var collar = _repository.CollarGet(new CollarSearchRequest { Keywords = file.CTN }).Data.FirstOrDefault(c => c.CollarId == file.CTN);

                if (collar == null)
                    continue;

                var passes = new List<ArgosSatellitePass>();
                var dataRows = new List<ArgosCollarData>();

                foreach (var row in file.Rows.Where(r => string.IsNullOrEmpty(r.Error) && r.Timestamp.HasValue && r.Timestamp <= DateTime.Now && r.Timestamp > DateTime.MinValue))
                {
                    IridiumOutputFileRow rowAsIridium = row as IridiumOutputFileRow;
                    ArgosOutputFileRow rowAsArgos = row as ArgosOutputFileRow;
                    var p = new ArgosSatellitePass { Timestamp = row.Timestamp.Value };

                    if (row.GpsFixAttempt == "Succeeded")
                    {
                        if (!row.GpsLatitude.HasValue || !row.GpsLongitude.HasValue)
                            continue;

                        if (row.GpsLatitude.Value < 0 || row.GpsLatitude.Value > 90 || row.GpsLongitude.Value < -180 || row.GpsLongitude.Value > 0)
                            continue;

                        p.Latitude = row.GpsLatitude.Value;
                        p.Longitude = row.GpsLongitude.Value;
                        p.LocationClass = ArgosOutputFileRow.GPS_LOCATION_CLASS;
                        passes.Add(p);
                    }
                    else if (rowAsArgos != null && validLocClasses.Contains(rowAsArgos.LocationClass))
                    {

                        if (!rowAsArgos.ArgosLatitude.HasValue || !rowAsArgos.ArgosLongitude.HasValue || !rowAsArgos.Timestamp.HasValue)
                            continue;

                        if (rowAsArgos.ArgosLatitude.Value < 0 || rowAsArgos.ArgosLatitude.Value > 90 || rowAsArgos.ArgosLongitude.Value < -180 || rowAsArgos.ArgosLongitude.Value > 0)
                            continue;

                        p.Latitude = rowAsArgos.ArgosLatitude.Value;
                        p.Longitude = rowAsArgos.ArgosLongitude.Value;
                        p.LocationClass = rowAsArgos.LocationClass;
                        passes.Add(p);
                    }
                    else if (rowAsIridium != null && rowAsIridium.IridiumLatitude != null)
                    {

                        if (!rowAsIridium.IridiumLatitude.HasValue || !rowAsIridium.IridiumLongitude.HasValue)
                            continue;

                        if (rowAsIridium.IridiumLatitude.Value < 0 || rowAsIridium.IridiumLatitude.Value > 90 || rowAsIridium.IridiumLongitude.Value < -180 || rowAsIridium.IridiumLongitude.Value > 0)
                            continue;

                        
                        //Allow CEP less than or equal to 5 *email June 24th Bonnie
                        int radius;
                        if (rowAsIridium.IridiumCepRadius != null
                            && int.TryParse(rowAsIridium.IridiumCepRadius, out radius))
                        {
                            if(radius <= 5)
                                p.CepRadius = rowAsIridium.IridiumCepRadius;
                        }


                        p.Latitude = rowAsIridium.IridiumLatitude.Value;
                        p.Longitude = rowAsIridium.IridiumLongitude.Value;
                       
                        passes.Add(p);
                    }
                    else
                    {
                        if (row.Temperature.HasValue)
                        {
                            var data = new ArgosCollarData
                            {
                                CollaredAnimalId = collar.Key,
                                Date = row.Timestamp.Value,
                                ValueType = ArgosCollarDataValueType.Temperature,
                                Value = string.Format("{0}", row.Temperature.Value)
                            };

                            dataRows.Add(data);
                        }

                        if (row.RepititionCount.HasValue)
                        {
                            var data = new ArgosCollarData
                            {
                                CollaredAnimalId = collar.Key,
                                Date = row.Timestamp.Value,
                                ValueType = ArgosCollarDataValueType.RepititionCount,
                                Value = string.Format("{0}", row.RepititionCount)
                            };

                            dataRows.Add(data);
                        }

                        if (!string.IsNullOrEmpty(row.LowVoltage))
                        {
                            var data = new ArgosCollarData
                            {
                                CollaredAnimalId = collar.Key,
                                Date = row.Timestamp.Value,
                                ValueType = ArgosCollarDataValueType.LowVoltage,
                                Value = string.Format("{0}", row.LowVoltage.Trim())
                            };

                            dataRows.Add(data);
                        }

                        if (!string.IsNullOrEmpty(row.Mortality))
                        {
                            var data = new ArgosCollarData
                            {
                                CollaredAnimalId = collar.Key,
                                Date = row.Timestamp.Value,
                                ValueType = ArgosCollarDataValueType.Mortality,
                                Value = string.Format("{0}", row.Mortality.Trim())
                            };

                            dataRows.Add(data);
                        }
                    }
                }

                _repository.ArgosCollarDataMerge(collar.Key, dataRows);
                _repository.ArgosPassMerge(collar.Key, passes);

                if (dataRows.Count() > 0)
                    RunDataChecks(collar, dataRows);

                if (passes.Count() > 0)
                    locatedCollars.Add(collar);
            }

            if (locatedCollars.Count() > 0)
                RunLocationChecks(locatedCollars);
        }

        /// <summary>
        /// Applies the business logic related to flagging locations with warnings
        /// </summary>
        /// <param name="collars">The collars that need checked</param>
        private void RunLocationChecks(IEnumerable<Collar> collars)
        {
            var badPassStatus = _repository.ArgosPassStatusGet(new Dto.PagedDataRequest()).Data.First(status => !status.IsRejected && status.Name.Contains("Error"));
            var kmPerHour = 30;

            var collarWarningState = _repository.CollarStateGet(new CollarStateRequest { RowCount = 999 }).Data.FirstOrDefault(s => s.Name.Contains("With Warnings"));

            foreach (var collar in collars)
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

                        if (pass.ManualQA == true) 
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

                                //if (string.IsNullOrEmpty(comment))
                                //    comment += "Flagged during import: " + Math.Round(distance, 2) + " km traveled in " + FormatSpan(span);
                                //else if (!comment.Contains("Flagged during import"))
                                //    comment += Environment.NewLine + "Flagged during import: " + Math.Round(distance, 2) + " km traveled in " + FormatSpan(span);

                                //_repository.CollarUpdateWarning(collar.Key, collarWarningState.Key, "Location Status", string.Format("Value reportered on {0:MM/dd/yyyy} at {1:h:mm:ss tt}", pass.LocationDate, pass.LocationDate), badPassStatus.Name);

                                //_repository.ArgosPassUpdate(pass.Key, badPassStatus.Key, comment);
                            }
                        }

                        lastLocationDate = pass.LocationDate;
                        lastCoord = myCoord;
                    }
                }
            }
        }

        private void RunDataChecks(Collar collar, IEnumerable<ArgosCollarData> dataRows)
        {
            var collarWarningState = _repository.CollarStateGet(new CollarStateRequest { RowCount = 999 }).Data.FirstOrDefault(s => s.Name.Contains("With Warnings"));

            // if the alert is already there, don't beat a dead horse (or caribou) 
            //  if (collar.CollarState.Key == collarWarningState.Key)
            //      return;

            // these flags make sure you only receive one warning per day
            var hasVoltageAlert = false;
            var hasMortalityAlert = false;

            foreach (var dataRow in dataRows.Where(r => r.Value.ToLower() == "yes" && (r.ValueType == ArgosCollarDataValueType.Mortality || r.ValueType == ArgosCollarDataValueType.LowVoltage)).OrderBy(r => r.Date))
            {
                try
                {
                    switch (dataRow.ValueType)
                    {
                        case ArgosCollarDataValueType.LowVoltage:
                            if (dataRow.Value.ToLower() == "yes" && !hasVoltageAlert)
                            {
                                _repository.CollarUpdateWarning(collar.Key, collar.CollarState.Key, "Collar Low Voltage", string.Format("Value reportered on {0:MM/dd/yyyy} at {1:h:mm:ss tt}", dataRow.Date, dataRow.Date), "Yes");
                                hasVoltageAlert = true;
                            }
                            break;
                        case ArgosCollarDataValueType.Mortality:
                            if (dataRow.Value.ToLower() == "yes" && !hasMortalityAlert)
                            {
                                _repository.CollarUpdateWarning(collar.Key, collarWarningState.Key, "Animal Mortality", string.Format("Value reportered on {0:MM/dd/yyyy} at {1:h:mm:ss tt}", dataRow.Date, dataRow.Date), "Yes");
                                hasMortalityAlert = true;
                            }
                            break;
                        default:
                            break;
                    }
                }
                catch(Exception)
                {
                    throw new Exception("Error on CollarID : " + collar.Key + " Collar state is: " + collar.CollarState);
                }
            }
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