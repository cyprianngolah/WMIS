namespace Wmis.ApiControllers
{
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;
	using System.Net;
	using System.Net.Http;
	using System.Text;
	using System.Threading.Tasks;
    using System.Net.Http.Headers;
    using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

    using Wmis.Auth;
	using Wmis.Logic;
	using Wmis.WebApi;
    using NPOI.HSSF.UserModel;
    using File = System.IO.File;
    using Dto.WMISTools;


    /// <summary>
	/// Bio Diversity API Controller
	/// </summary>
	[RoutePrefix("api/tools")]
    public class ToolsApiController : BaseApiController
    {
        private readonly Auth.WmisUser _user;

        public ToolsApiController(WebConfiguration config, Auth.WmisUser user) 
			: base(config)
		{
            _user = user;
		}
        
		[HttpPost]
		[Route("batchReject")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public void BatchReject([FromBody] IEnumerable<ToolsBatchRejectRequest> request)
        {
            Repository.BatchReject(request);
        }

        [HttpPost]
        [Route("resetHerdPopulation")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public void BatchReject([FromBody] IEnumerable<ToolsResetHerdPopulationRequest> request)
        {
            Repository.ResetHerdPopulation(request);
        }
        
        [HttpGet]
        [Route("rejectPreDeployment")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public int RejectPredeploymentLocations()
        {
            return Repository.RejectPredeploymentLocations();
        }

        [HttpGet]
        [Route("rejectDuplicates")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public int RejectExactDuplicateLocations()
        {
            return Repository.RejectExactDuplicateLocations();
        }

        [HttpGet]
        [Route("rejectAfterInactiveDate")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public int RejectLocationsAfterInactiveDate()
        {
            return Repository.RejectLocationsAfterInactiveDate();
        }


        [HttpPost]
        [Route("retrievedCollarData/upload")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public async Task<IEnumerable<ToolsCollarData>> UploadFile()
        {
            // Save the File to a Temporary path (generally C:/Temp
            var uploadPath = Path.Combine(Path.GetTempPath(), "WMIS");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
            var streamProvider = new MultipartFormDataStreamProvider(uploadPath);
            await Request.Content.ReadAsMultipartAsync(streamProvider);
           
            FileInfo tempFile = null;
            try
            {
                // Move the file to a location specified in the ObservationFileSaveDirectory AppSetting
                var destinationFolder = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];

                var tempFileData = streamProvider.FileData.First();
                tempFile = new FileInfo(tempFileData.LocalFileName);
                var originalFile = new FileInfo(tempFileData.Headers.ContentDisposition.FileName.Replace("\"", ""));
                
                
                if (!originalFile.Extension.ToLower().Contains("csv"))
                {
                    throw new ObservationUploadException("Invalid File Extension. Collar Data Upload only supports .csv extensions.");
                }

                var destinationFile = String.Concat(Guid.NewGuid(), originalFile.Extension);
                var destinationFilePath = Path.Combine(destinationFolder, destinationFile);
                File.Copy(tempFileData.LocalFileName, destinationFilePath);
                
                // process the file (destinationFilePath) and return the results to screen
                FileInfo csvFile = new FileInfo(destinationFilePath);
                var reader = new ToolsFileReader();
                var outFile = reader.ParseFile(csvFile);

                return reader.GetRetrievedCollarDataRows(outFile);
                
            }
            finally
            {
                if (tempFile != null && tempFile.Exists)
                {
                    try
                    {
                        tempFile.Delete();
                    }
                    catch
                    {
                    }
                }
            }

        }

        [HttpPost]
        [Route("loadPostRetrievalData")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public void LoadPostRetrievalData([FromBody] IEnumerable<ToolsCollarData> request)
        {
            Repository.LoadPostRetrievalData(request);
        }

        [HttpPost]
        [Route("lotek/upload")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public async Task<IEnumerable<ToolsLotekData>> UploadLotekFile()
        {
            // Save the File to a Temporary path (generally C:/Temp
            var uploadPath = Path.Combine(Path.GetTempPath(), "WMIS");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
            var streamProvider = new MultipartFormDataStreamProvider(uploadPath);
            await Request.Content.ReadAsMultipartAsync(streamProvider);

            FileInfo tempFile = null;
            try
            {
                // Move the file to a location specified in the ObservationFileSaveDirectory AppSetting
                var destinationFolder = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];

                var tempFileData = streamProvider.FileData.First();
                tempFile = new FileInfo(tempFileData.LocalFileName);
                var originalFile = new FileInfo(tempFileData.Headers.ContentDisposition.FileName.Replace("\"", ""));
                if (!originalFile.Extension.ToLower().Contains("csv"))
                {
                    throw new ObservationUploadException("Invalid File Extension. Collar Data Upload only supports .csv extensions.");
                }

                var destinationFile = String.Concat(Guid.NewGuid(), originalFile.Extension);
                var destinationFilePath = Path.Combine(destinationFolder, destinationFile);
                File.Copy(tempFileData.LocalFileName, destinationFilePath);

                // process the file (destinationFilePath) and return the results to screen
                FileInfo csvFile = new FileInfo(destinationFilePath);
                var reader = new ToolsLotekFileReader();
                var outFile = reader.ParseLotekFile(csvFile);

                return reader.GetLotekDataRows(outFile);

            }
            finally
            {
                if (tempFile != null && tempFile.Exists)
                {
                    try
                    {
                        tempFile.Delete();
                    }
                    catch
                    {
                    }
                }
            }
        }

        [HttpPost]
        [Route("loadLotekData")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public void LoadLotekData([FromBody] IEnumerable<ToolsLotekData> request)
        {
            Repository.LoadLotekData(request);
        }

        [HttpPost]
        [Route("loadVectronicsData")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorProjects)]
        public void LoadVectronicsData([FromBody] IEnumerable<VectronicsDataRequest> request)
        {
            Repository.LoadVectronicsData(request);
        }

    }
}
