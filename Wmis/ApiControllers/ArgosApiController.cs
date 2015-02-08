namespace Wmis.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.IO;
    using System.IO.Compression;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Web.Http;
    using System.Xml.Serialization;
    using DotSpatial.Data;
    using DotSpatial.Topology;
    using Wmis.ApiControllers;
    using Wmis.Configuration;
    using Wmis.Dto;
    using Wmis.Models;
    
    [RoutePrefix("api/argos")]
    public class ArgosApiController : BaseApiController
    {
        public ArgosApiController(WebConfiguration config) 
			: base(config)
		{
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
          
            var fs = new FeatureSet(FeatureType.MultiPoint);
////            fs.Projection = KnownCoordinateSystems.Geographic.World.
            fs.DataTable.Columns.Add(new DataColumn("ID", typeof(int)));
            fs.DataTable.Columns.Add(new DataColumn("Text", typeof(string)));
            fs.DataTable.Columns.Add(new DataColumn("Latitude", typeof(double)));
            fs.DataTable.Columns.Add(new DataColumn("Longitude", typeof(double)));
            fs.DataTable.Columns.Add(new DataColumn("Date", typeof(string)));
            fs.DataTable.Columns.Add(new DataColumn("Status", typeof(string)));

            passes.ForEach(
                pass =>
                    {
                        var feature = fs.AddFeature(new Point(pass.Latitude, pass.Longitude));
                        feature.DataRow.BeginEdit();
                        feature.DataRow["ID"] = pass.Key;
                        feature.DataRow["Latitude"] = pass.Latitude;
                        feature.DataRow["Longitude"] = pass.Longitude;
                        feature.DataRow["Date"] = string.Format("{0:s}", pass.LocationDate);
                        feature.DataRow["Status"] = pass.ArgosPassStatus.Name;
                        feature.DataRow.EndEdit();
                    });
           
            const string ShapeFileName = @"C:\Users\Public\testdir\test.shp";
            fs.SaveAs(ShapeFileName, true);
     
            const string ZipPath = @"C:\Users\Public\test.zip";
            ZipFile.CreateFromDirectory(@"C:\Users\Public\testdir\", ZipPath);

            var stream = new FileStream(ZipPath, FileMode.Open);

            var response = new FileHttpResponseMessage(ZipPath)
            {
                Content = new StreamContent(stream)
            };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = "passes.zip"
            };
            return response;
        }
        
        [HttpPost]
        [Route("run/{collaredAnimalId:int?}")]
        public List<ArgosPassForTvp> RetrieveForCollar(int collaredAnimalId)
        {
            var subscriptionId = Repository.CollarGet(collaredAnimalId).SubscriptionId;
            return string.IsNullOrEmpty(subscriptionId) ? new List<ArgosPassForTvp>() : this.RetrievePathFromArgos(int.Parse(subscriptionId), collaredAnimalId);
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
            Repository.ArgosPassUpdate(request.ArgosPassId, request.ArgosPassStatusId);
        }

        private static ArgosData ConvertArgosXmlStringToArgosData(string xmlString)
        {
            var xmlStringReader = new StringReader(xmlString);
            var xRoot = new XmlRootAttribute { ElementName = "data", IsNullable = true };
            var serializer = new XmlSerializer(typeof(ArgosData), xRoot);
            return (ArgosData)serializer.Deserialize(xmlStringReader);
        }

        private static List<ArgosPassForTvp> ConvertArgosDataToPasses(ArgosData argosData)
        {
            var passes = argosData.program[0].platform[0].satellitePass;
            var nonNull = passes.Where(pass => pass.location != null);
            var coordinates = nonNull.Select(pass => new ArgosPassForTvp { Latitude = pass.location.latitude, Longitude = pass.location.longitude, LocationDate = pass.location.locationDate });
            return coordinates.ToList();
        }

        private static string RetreiveXsd()
        {
            var service = new ArgosService.DixServicePortTypeClient();
            var request = new ArgosService.xsdRequestType();
            var response = service.getXsd(request);
            return response.@return;
        }

        /*
         * Other valid credentials:
         * sahtu / gisewo
         * nagyjohn / bluenose
         */
        private static string RetreiveArgosXmlStringForCollar(int subscriptionId)
        {
            var service = new ArgosService.DixServicePortTypeClient();

            var request = new ArgosService.xmlRequestType
                              {
                                  username = "gunn",
                                  password = "northter",
                                  Item1 = RecordsForLastDays(9),
                                  ItemElementName = ArgosService.ItemChoiceType.platformId,
                                  Item = subscriptionId.ToString()
                              };
                        
            ArgosService.stringResponseType res = service.getXml(request);
            return res.@return;
        }

        private static ArgosService.periodType RecordsFromDate(int year, int month, int day)
        {
            return new ArgosService.periodType { startDate = new DateTime(year, month, day), endDateSpecified = false };
        }

        private static int RecordsForLastDays(int days)
        {
            return days;
        }

        private List<ArgosPassForTvp> RetrievePathFromArgos(int subscriptionId, int collaredAnimalId)
        {
            var argosXmlString = RetreiveArgosXmlStringForCollar(subscriptionId);
            var argosData = ConvertArgosXmlStringToArgosData(argosXmlString);
            //No data check
            if (argosData.program == null)
                return new List<ArgosPassForTvp>();
            var argosPasses = ConvertArgosDataToPasses(argosData);

            Repository.ArgosPassMerge(collaredAnimalId, argosPasses);

            return argosPasses;
        }
    }
}
