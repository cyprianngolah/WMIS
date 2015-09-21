﻿namespace Wmis.Controllers
{
    using DotSpatial.Data;
    using DotSpatial.Projections;
    using DotSpatial.Topology;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.IO;
    using System.IO.Compression;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Net.NetworkInformation;
    using System.Web.Http;
    using Wmis.ApiControllers;
    using Wmis.Argos.Entities;
    using Wmis.Configuration;
    using Wmis.Dto;
    using Wmis.Logic;
    using Wmis.Models;

    [RoutePrefix("api/argos")]
    public class ArgosApiController : BaseApiController
    {
        #region Fields

        private readonly ArgosJobService _argosJobService;

        #endregion Fields

        #region Constructor

        public ArgosApiController(WebConfiguration config, ArgosJobService argosJobService)
            : base(config)
        {
            _argosJobService = argosJobService;
        }

        #endregion Constructor

        [HttpGet]
        [Route("schedule")]
        public string Schedule()
        {
            return WebConfiguration.AppSettings["ArgosWebserviceScheduleCronExpression"];
        }

        [HttpPost]
        [Route("schedule")]
        public void GetSchedule()
        {
            _argosJobService.ScheduleArgos();
        }

        [HttpPost]
        [Route("queueJobs")]
        public void QueueJobs()
        {
            _argosJobService.ProcessArgosCollars();
        }

        [HttpPost]
        [Route("accessCollarsFolder")]
        public bool AccessCollarsFolder()
        {
            var collarsFolder = WebConfiguration.AppSettings["ProcessedArgosCollarsDirectory"];

            Ping ping = new Ping();
            var server = collarsFolder.Split(';');
            PingReply respoPingReply = ping.Send(server[0], 1000);
            if (respoPingReply.Status == IPStatus.Success)
            {
                var folder = @"\\" + server[0];
                folder = Path.Combine(folder, server[1]);
                if (Directory.Exists(folder))
                {
                    
                }
            }
            return false;
        }

        [HttpGet]
        [Route("passes")]
        public Dto.PagedResultset<ArgosPass> PassesForCollar([FromUri]ArgosPassSearchRequest apsr)
        {
            return Repository.ArgosPassGet(apsr);
        }

        [HttpGet]
        [Route("passesShapeFile")]
        public HttpResponseMessage PassesForCollar2([FromUri]ArgosPassSearchRequest apsr)
        {
            var passes = Repository.ArgosPassGet(apsr).Data;
            var animal = Repository.CollarGet(apsr.CollaredAnimalId);

            using (var myPoints = new FeatureSet(FeatureType.Point))
            {
                myPoints.Projection = KnownCoordinateSystems.Geographic.World.WGS1984;

                myPoints.DataTable.Columns.Add(new DataColumn("ID", typeof(int)));
                myPoints.DataTable.Columns.Add(new DataColumn("Latitude", typeof(double)));
                myPoints.DataTable.Columns.Add(new DataColumn("Longitude", typeof(double)));
                myPoints.DataTable.Columns.Add(new DataColumn("Location Class", typeof(string)));
                myPoints.DataTable.Columns.Add(new DataColumn("Date", typeof(string)));
                myPoints.DataTable.Columns.Add(new DataColumn("Time", typeof(string)));
                myPoints.DataTable.Columns.Add(new DataColumn("AnimalID", typeof(string)));
                myPoints.DataTable.Columns.Add(new DataColumn("Status", typeof(string)));
                myPoints.DataTable.Columns.Add(new DataColumn("Comment", typeof(string)));

                foreach (var pass in passes)
                {
                    var coord = new Coordinate(pass.Longitude, pass.Latitude);
                    var newPoint = new DotSpatial.Topology.Point(coord);
                    var feature = myPoints.AddFeature(newPoint);
                    feature.DataRow.BeginEdit();
                    feature.DataRow["ID"] = pass.Key;
                    feature.DataRow["Latitude"] = pass.Latitude;
                    feature.DataRow["Longitude"] = pass.Longitude;
                    feature.DataRow["Location Class"] = pass.LocationClass;
                    feature.DataRow["Date"] = pass.LocationDate.ToString("yyyy-mm-dd HH:MM");
                    feature.DataRow["Time"] = pass.LocationDate.TimeOfDay;
                    feature.DataRow["AnimalID"] = animal.AnimalId;
                    feature.DataRow["Status"] = pass.ArgosPassStatus.Name;
                    feature.DataRow["Comment"] = pass.Comment;
                    feature.DataRow.EndEdit();
                }

                var baseFileName = animal.AnimalId ?? ("Animal_" + animal.Key);
                var baseDirectory = @"C:\Users\Public\WMIS_ShapeFiles\";
                var directoryName = Path.Combine(baseDirectory, baseFileName);

                string ShapeFileName = Path.Combine(directoryName, baseFileName + ".shp");
                myPoints.SaveAs(ShapeFileName, true);

                string ZipPath = Path.Combine(baseDirectory, baseFileName + ".zip");

                var zipFile = new FileInfo(ZipPath);

                if (zipFile.Exists)
                    zipFile.Delete();

                ZipFile.CreateFromDirectory(directoryName, ZipPath);

                var response = new FileHttpResponseMessage(ZipPath);

                using (var stream = new FileStream(ZipPath, FileMode.Open))
                {
                    var bytes = new byte[stream.Length];

                    stream.Read(bytes, 0, bytes.Length);
                    response.Content = new ByteArrayContent(bytes);
                }

                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = baseFileName + ".zip"
                };

                zipFile.Delete();
                new DirectoryInfo(directoryName).Delete(true);

                return response;
            }
        }

        [HttpPost]
        [Route("run/{collaredAnimalId:int?}")]
        public IEnumerable<ArgosSatellitePass> RetrieveForCollar(int collaredAnimalId)
        {
            var collar = Repository.CollarGet(collaredAnimalId);
            var subscriptionId = collar.SubscriptionId;
            return _argosJobService.GetArgosDataForCollar(collar.ArgosProgram, collaredAnimalId, subscriptionId);
        }

        [HttpGet]
        [Route("passStatuses")]
        public PagedResultset<ArgosPassStatus> GetArgosPassStatus([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.ArgosPassStatusGet(request);
        }

        [HttpPost]
        [Route("pass/save")]
        public void UpdateArgosPass([FromBody]Dto.ArgosPassUpdateRequest request)
        {
            Repository.ArgosPassUpdate(request.ArgosPassId, request.ArgosPassStatusId, request.Comment);
        }
    }
}