namespace Wmis.Controllers
{
	using System.Collections.Generic;
    using System.Data;
    using System.IO;
    using System.IO.Compression;
	using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Web.Http;

	using DotSpatial.Data;
    using DotSpatial.Topology;
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
		#endregion

		public ArgosApiController(WebConfiguration config, ArgosJobService argosJobService) 
			: base(config)
		{
			_argosJobService = argosJobService;
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
		public IEnumerable<ArgosSatellitePass> RetrieveForCollar(int collaredAnimalId)
        {
            var subscriptionId = Repository.CollarGet(collaredAnimalId).SubscriptionId;
			return _argosJobService.GetArgosDataForCollar(collaredAnimalId, subscriptionId);
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
    }
}
