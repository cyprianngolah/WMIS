namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;
    using Configuration;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.IO;
    using NPOI.HSSF.UserModel;

    using Wmis.Auth;
    using Dto;
    using Models;
    using System.Net;
    using System;
    using System.Text;
    using System.Threading.Tasks;
    using Wmis.Logic;
    using Wmis.WebApi;


    [RoutePrefix("api/rabiestests")]
    public class RabiesTestsApiController : BaseApiController
    {
        private readonly Auth.WmisUser _user;

        public const string RabiesTestsBulkUploadErrorString = "RabiesTestsBulkUploadError";
        public const string RabiesTestsBulkUploadString = "RabiesTestsBulkUpload";
        public const string DownloadErrorString = "FileDownloadError";

        public RabiesTestsApiController(WebConfiguration config, Auth.WmisUser user)
            : base(config)
        {
            _user = user;
        }

        [HttpGet]
        [Route]
        public Dto.PagedResultset<RabiesTests> GetRabiesTests([FromUri] Dto.RabiesTestsRequest rt)
        {
            return Repository.RabiesTestsSearch(rt);
        }

        [HttpGet]
        [Route("download")]
        public HttpResponseMessage DownloadRabiesTests([FromUri] RabiesTestsRequest rt)
        {
            var lstData = Repository.RabiesTestsDownload(rt);

            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet("RabiesTests");

            var header = sheet.CreateRow(0);
            header.CreateCell(0).SetCellValue("DateTested");
            header.CreateCell(1).SetCellValue("DataStatus");
            header.CreateCell(2).SetCellValue("Year");
            header.CreateCell(3).SetCellValue("SubmittingAgency");
            header.CreateCell(4).SetCellValue("LaboratoryIDNo");
            header.CreateCell(5).SetCellValue("TestResult");
            header.CreateCell(6).SetCellValue("Community");
            header.CreateCell(7).SetCellValue("Latitude");
            header.CreateCell(8).SetCellValue("Longitude");
            header.CreateCell(9).SetCellValue("RegionId");
            header.CreateCell(10).SetCellValue("GeographicRegion");
            header.CreateCell(11).SetCellValue("Species");
            header.CreateCell(12).SetCellValue("AnimalContact");
            header.CreateCell(13).SetCellValue("HumanContact");
            header.CreateCell(14).SetCellValue("Comments");
           
            var rowIndex = 1;

            foreach (var data in lstData.Data)
            {
                var row = sheet.CreateRow(rowIndex);
                row.CreateCell(0).SetCellValue(data.DateTested.ToString());
                row.CreateCell(1).SetCellValue(data.DataStatus);
                row.CreateCell(2).SetCellValue(data.Year);
                row.CreateCell(3).SetCellValue(data.SubmittingAgency);
                row.CreateCell(4).SetCellValue(data.LaboratoryIDNo);
                row.CreateCell(5).SetCellValue(data.TestResult);
                row.CreateCell(6).SetCellValue(data.Community);
                row.CreateCell(7).SetCellValue(data.Latitude);
                row.CreateCell(8).SetCellValue(data.Longitude);
                row.CreateCell(9).SetCellValue(data.RegionId);
                row.CreateCell(10).SetCellValue(data.GeographicRegion);
                row.CreateCell(11).SetCellValue(data.Species);
                row.CreateCell(12).SetCellValue(data.AnimalContact);
                row.CreateCell(13).SetCellValue(data.HumanContact);
                row.CreateCell(14).SetCellValue(data.Comments);
                rowIndex++;
            }

            var directoryName = Path.Combine(Path.GetTempPath(), "WMIS");
            string strFile = "RabiesTests_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
            string fullPath = Path.Combine(directoryName, strFile);

            if (!Directory.Exists(directoryName))
            {
                Directory.CreateDirectory(directoryName);
            }

            using (var fileStream = System.IO.File.Create(fullPath))
            {
                workbook.Write(fileStream);
            }

            if (System.IO.File.Exists(fullPath))
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = strFile
                };

                return response;
            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);


        }


        [HttpPost]
        [Route]
        [WmisWebApiAuthorize(Roles = WmisRoles.WMISDiseaseAdministrator)]
        public int Create([FromBody] RabiesTests wnn)
        {
            return Repository.RabiesTestsCreate(wnn, _user.Username);
        }


        [HttpPut]
        [Route]
        [WmisWebApiAuthorize(Roles = WmisRoles.WMISDiseaseAdministrator)]
        public DateTime Update([FromBody] RabiesTests rt)
        {
            return Repository.RabiesTestsUpdate(rt, _user.Username);
        }

        [HttpPost]
        [Route("upload")]
        [IFrameProgressExceptionHandler(RabiesTestsBulkUploadErrorString)]
        [WmisWebApiAuthorize(Roles = WmisRoles.WMISDiseaseAdministrator)]
        public async Task<HttpResponseMessage> Upload()
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
                if (!originalFile.Extension.Contains("xls"))
                {
                    throw new ObservationUploadException("Invalid File Extension. Observation Upload only supports .xls or .xlsx extensions.");
                }
                // perform another validation to check if the file uploaded is the correct template

                var destinationFile = String.Concat(Guid.NewGuid(), originalFile.Extension);
                var destinationFilePath = Path.Combine(destinationFolder, destinationFile);
                System.IO.File.Copy(tempFileData.LocalFileName, destinationFilePath);

                // save the uploaded process to database
                Repository.AddBulkUploadRabiesTests(originalFile.Name, destinationFilePath, "RabiesTests", destinationFile);

                // now merge the data to the database
                var data = new RabiesTestsBulkUploaderService().GetData(destinationFilePath, 1);
                //Test to see if it reached here
                // System.Web.HttpContext.Current.Response.Write("Data is about to be inserted");
                Repository.BulkInsertRabiesTests(data);

                // send the response back to EventListener
                var pageBuilder = new StringBuilder();
                pageBuilder.Append("<html><head></head>");
                pageBuilder.Append(String.Format("<body><script type='text/javascript'>parent.postMessage('{0}:{{1}}', '*');</script></body></html>", RabiesTestsBulkUploadString));
                return Request.CreateResponse(HttpStatusCode.OK, pageBuilder.ToString(), new PlainTextFormatter());

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

        [HttpGet]
        [Route("uploads/download")]
        [IFrameProgressExceptionHandler(DownloadErrorString)]
        public HttpResponseMessage DownloadFile([FromUri] string fileName)
        {

            if (!string.IsNullOrEmpty(fileName))
            {

                string filePath = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];
                string fullPath = Path.Combine(filePath, fileName);

                if (!System.IO.File.Exists(fullPath))
                {

                    return new HttpResponseMessage()
                    {
                        Content = new StringContent(
                            "<h3>File seems to be missing or unavailable at this time. Try again later or contact WMIS support.</h3>", Encoding.UTF8, "text/html"
                        )
                    };
                    //throw new HttpResponseException(HttpStatusCode.Moved);
                }


                if (System.IO.File.Exists(fullPath))
                {
                    var newFile = String.Concat(DateTime.Now.ToString("yyyyMMddHHmmss"), fileName);
                    var newFilePath = Path.Combine(filePath, newFile);

                    System.IO.File.Copy(fullPath, newFilePath);

                    var response = new FileHttpResponseMessage(newFilePath);
                    using (var stream = new FileStream(newFilePath, FileMode.Open))
                    {
                        var bytes = new byte[stream.Length];
                        stream.Read(bytes, 0, bytes.Length);
                        response.Content = new ByteArrayContent(bytes);
                    }

                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = newFile
                    };

                    return response;
                }

            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);

        }

        [HttpGet]
        [Route("uploads")]
        public Dto.PagedResultset<Models.RabiesTestsBulkUploads> GetRabiesBulkUploads([FromUri] Dto.PagedDataKeywordRequest str)
        {
            return Repository.RabiesTestsBulkUploadsGet(str ?? new Dto.PagedDataKeywordRequest());
        }


        [HttpDelete]
        [Route("Rabies/{TestId:int}/delete")]
        [WmisWebApiAuthorize(Roles = WmisRoles.WMISDiseaseAdministrator)]
        public void DeleteRabiesTests(int TestId)
        {
            Repository.RabiesTestsDelete(TestId);
        }

    }
}