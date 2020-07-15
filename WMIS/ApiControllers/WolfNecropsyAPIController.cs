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


    [RoutePrefix("api/wolfnecropsy")]
    public class WolfNecropsyApiController : BaseApiController
    {
        private readonly Auth.WmisUser _user;

        public const string WolfNecropsyBulkUploadErrorString = "WolfNecropsyBulkUploadError";
        public const string WolfNecropsyBulkUploadString = "WolfNecropsyBulkUpload";
        public const string DownloadErrorString = "FileDownloadError";

        public WolfNecropsyApiController(WebConfiguration config, Auth.WmisUser user)
            : base(config)
        {
           _user = user;
        }

        [HttpGet]
        [Route]
        public Dto.PagedResultset<WolfNecropsy> GetWolfNecropsy([FromUri] Dto.WolfNecropsyRequest wnr)
        {
            return Repository.WolfnecropsySearch(wnr);
        }

        [HttpGet]
        [Route("download")]
        public HttpResponseMessage DownloadWolfNecropsy([FromUri] WolfNecropsyRequest pr)
        {
            var lstData = Repository.WolfNecropsyDownload(pr);

            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet("Necropsy");

            var header = sheet.CreateRow(0);
            header.CreateCell(0).SetCellValue("NecropsyID");
            header.CreateCell(1).SetCellValue("Species");
            header.CreateCell(2).SetCellValue("Date");
            header.CreateCell(3).SetCellValue("Sex");
            header.CreateCell(4).SetCellValue("Location");
            header.CreateCell(5).SetCellValue("GridCell");
            header.CreateCell(6).SetCellValue("DateReceived");
            header.CreateCell(7).SetCellValue("DateKilled");
            header.CreateCell(8).SetCellValue("AgeClass");
            header.CreateCell(9).SetCellValue("AgeEstimated");
            header.CreateCell(10).SetCellValue("Submitter");
            header.CreateCell(11).SetCellValue("ContactInfo");
            header.CreateCell(12).SetCellValue("RegionId");
            header.CreateCell(13).SetCellValue("MethodKilled");
            header.CreateCell(14).SetCellValue("Injuries");
            header.CreateCell(15).SetCellValue("TagComments");
            header.CreateCell(16).SetCellValue("TagReCheck");
            header.CreateCell(17).SetCellValue("BodyWt_unskinned");
            header.CreateCell(18).SetCellValue("NeckGirth_unsk");
            header.CreateCell(19).SetCellValue("ChestGirth_unsk");
            header.CreateCell(20).SetCellValue("Contour_Nose_Tail");
            header.CreateCell(21).SetCellValue("Tail_Length");
            header.CreateCell(22).SetCellValue("BodyWt_skinned");
            header.CreateCell(23).SetCellValue("PeltWt");
            header.CreateCell(24).SetCellValue("NeckGirth_sk");
            header.CreateCell(25).SetCellValue("ChestGirth_sk");
            header.CreateCell(26).SetCellValue("RumpFat");
            header.CreateCell(27).SetCellValue("TotalRank_Ext");
            header.CreateCell(28).SetCellValue("Tongue");
            header.CreateCell(29).SetCellValue("HairCollected");
            header.CreateCell(30).SetCellValue("SkullCollected");
            header.CreateCell(31).SetCellValue("HindLegMuscle_StableIsotopes");
            header.CreateCell(32).SetCellValue("HindLegMuscle_Contaminants");
            header.CreateCell(33).SetCellValue("Feces");
            header.CreateCell(34).SetCellValue("Diaphragm");
            header.CreateCell(35).SetCellValue("Lung ");
            header.CreateCell(36).SetCellValue("Liver_DNA");
            header.CreateCell(37).SetCellValue("Liver_SIA");
            header.CreateCell(38).SetCellValue("Liver_Contam");
            header.CreateCell(39).SetCellValue("Spleen");
            header.CreateCell(40).SetCellValue("KidneyL");
            header.CreateCell(41).SetCellValue("KidneyL_wt");
            header.CreateCell(42).SetCellValue("KidneyR");
            header.CreateCell(43).SetCellValue("KidneyR_wt");
            header.CreateCell(44).SetCellValue("Blood_tabs");
            header.CreateCell(45).SetCellValue("Blood_tubes");
            header.CreateCell(46).SetCellValue("Stomach");
            header.CreateCell(47).SetCellValue("StomachCont");
            header.CreateCell(48).SetCellValue("Stomach_Full");
            header.CreateCell(49).SetCellValue("Stomach_Empty");
            header.CreateCell(50).SetCellValue("StomachCont_wt");
            header.CreateCell(51).SetCellValue("StomachContentDesc");
            header.CreateCell(52).SetCellValue("IntestinalTract");
            header.CreateCell(53).SetCellValue("UterineScars");
            header.CreateCell(54).SetCellValue("Uterus");
            header.CreateCell(55).SetCellValue("Ovaries");
            header.CreateCell(56).SetCellValue("LymphNodes");
            header.CreateCell(57).SetCellValue("Others");
            header.CreateCell(58).SetCellValue("InternalRank");
            header.CreateCell(59).SetCellValue("PeltColor");
            header.CreateCell(60).SetCellValue("BackFat");
            header.CreateCell(61).SetCellValue("SternumFat");
            header.CreateCell(62).SetCellValue("InguinalFat");
            header.CreateCell(63).SetCellValue("Incentive");
            header.CreateCell(64).SetCellValue("IncentiveAmt");
            header.CreateCell(65).SetCellValue("Conflict");
            header.CreateCell(66).SetCellValue("GroupSize");
            header.CreateCell(67).SetCellValue("PackId");
            header.CreateCell(68).SetCellValue("Xiphoid");
            header.CreateCell(69).SetCellValue("Personnel");
            header.CreateCell(70).SetCellValue("Pictures");
            header.CreateCell(71).SetCellValue("SpeciesComments");
            header.CreateCell(72).SetCellValue("TagInjuryComments");
            header.CreateCell(73).SetCellValue("InjuryComments");
            header.CreateCell(74).SetCellValue("ExamInjuryComments");
            header.CreateCell(75).SetCellValue("ExamComments");
            header.CreateCell(76).SetCellValue("PicturesComments");
            header.CreateCell(77).SetCellValue("MeasurementsComments");
            header.CreateCell(78).SetCellValue("MissingPartsComments");
            header.CreateCell(79).SetCellValue("StomachContents");
            header.CreateCell(80).SetCellValue("OtherSamplesComments");
            header.CreateCell(81).SetCellValue("SamplesComments");
            header.CreateCell(82).SetCellValue("GeneralComments");

            var rowIndex = 1;

            foreach (var data in lstData.Data)
            {
                var row = sheet.CreateRow(rowIndex);
                row.CreateCell(0).SetCellValue(data.NecropsyId);
                row.CreateCell(1).SetCellValue(data.CommonName);
                row.CreateCell(2).SetCellValue(data.NecropsyDate.ToString());
                row.CreateCell(3).SetCellValue(data.Sex);
                row.CreateCell(4).SetCellValue(data.Location);
                row.CreateCell(5).SetCellValue(data.GridCell);
                row.CreateCell(6).SetCellValue(data.DateReceived.ToString());
                row.CreateCell(7).SetCellValue(data.DateKilled.ToString());
                row.CreateCell(8).SetCellValue(data.AgeClass);
                row.CreateCell(9).SetCellValue(data.AgeEstimated);
                row.CreateCell(10).SetCellValue(data.Submitter);
                row.CreateCell(11).SetCellValue(data.ContactInfo);
                row.CreateCell(12).SetCellValue(data.RegionId);
                row.CreateCell(13).SetCellValue(data.MethodKilled);
                row.CreateCell(14).SetCellValue(data.Injuries);
                row.CreateCell(15).SetCellValue(data.TagComments);
                row.CreateCell(16).SetCellValue(data.TagReCheck);
                row.CreateCell(17).SetCellValue(data.BodyWt_unskinned);
                row.CreateCell(18).SetCellValue(data.NeckGirth_unsk);
                row.CreateCell(19).SetCellValue(data.ChestGirth_unsk);
                row.CreateCell(20).SetCellValue(data.Contour_Nose_Tail);
                row.CreateCell(21).SetCellValue(data.Tail_Length);
                row.CreateCell(22).SetCellValue(data.BodyWt_skinned);
                row.CreateCell(23).SetCellValue(data.PeltWt);
                row.CreateCell(24).SetCellValue(data.NeckGirth_sk);
                row.CreateCell(25).SetCellValue(data.ChestGirth_sk);
                row.CreateCell(26).SetCellValue(data.RumpFat);
                row.CreateCell(27).SetCellValue(data.TotalRank_Ext);
                row.CreateCell(28).SetCellValue(data.Tongue);
                row.CreateCell(29).SetCellValue(data.HairCollected);
                row.CreateCell(30).SetCellValue(data.SkullCollected);
                row.CreateCell(31).SetCellValue(data.HindLegMuscle_StableIsotopes);
                row.CreateCell(32).SetCellValue(data.HindLegMuscle_Contaminants);
                row.CreateCell(33).SetCellValue(data.Femur);
                row.CreateCell(33).SetCellValue(data.Feces);
                row.CreateCell(34).SetCellValue(data.Diaphragm);
                row.CreateCell(35).SetCellValue(data.Lung);
                row.CreateCell(36).SetCellValue(data.Liver_DNA);
                row.CreateCell(37).SetCellValue(data.Liver_SIA);
                row.CreateCell(38).SetCellValue(data.Liver_Contam);
                row.CreateCell(39).SetCellValue(data.Spleen);
                row.CreateCell(40).SetCellValue(data.KidneyL);
                row.CreateCell(41).SetCellValue(data.KidneyL_wt);
                row.CreateCell(42).SetCellValue(data.KidneyR);
                row.CreateCell(43).SetCellValue(data.KidneyR_wt);
                row.CreateCell(44).SetCellValue(data.Blood_tabs);
                row.CreateCell(45).SetCellValue(data.Blood_tubes);
                row.CreateCell(46).SetCellValue(data.Stomach);
                row.CreateCell(47).SetCellValue(data.StomachCont);
                row.CreateCell(48).SetCellValue(data.Stomach_Full);
                row.CreateCell(49).SetCellValue(data.Stomach_Empty);
                row.CreateCell(50).SetCellValue(data.StomachCont_wt);
                row.CreateCell(51).SetCellValue(data.StomachContentDesc);
                row.CreateCell(52).SetCellValue(data.IntestinalTract);
                row.CreateCell(53).SetCellValue(data.UterineScars);
                row.CreateCell(54).SetCellValue(data.Uterus);
                row.CreateCell(55).SetCellValue(data.Ovaries);
                row.CreateCell(56).SetCellValue(data.LymphNodes);
                row.CreateCell(57).SetCellValue(data.Others);
                row.CreateCell(58).SetCellValue(data.InternalRank);
                row.CreateCell(59).SetCellValue(data.PeltColor);
                row.CreateCell(60).SetCellValue(data.BackFat);
                row.CreateCell(61).SetCellValue(data.SternumFat);
                row.CreateCell(62).SetCellValue(data.InguinalFat);
                row.CreateCell(63).SetCellValue(data.Incentive);
                row.CreateCell(64).SetCellValue(data.IncentiveAmt);
                row.CreateCell(65).SetCellValue(data.Conflict);
                row.CreateCell(66).SetCellValue(data.GroupSize);
                row.CreateCell(67).SetCellValue(data.PackId);
                row.CreateCell(68).SetCellValue(data.Xiphoid);
                row.CreateCell(69).SetCellValue(data.Personnel);
                row.CreateCell(70).SetCellValue(data.Pictures);
                row.CreateCell(71).SetCellValue(data.SpeciesComments);
                row.CreateCell(72).SetCellValue(data.TagInjuryComments);
                row.CreateCell(73).SetCellValue(data.InjuryComments);
                row.CreateCell(74).SetCellValue(data.ExamInjuryComments);
                row.CreateCell(75).SetCellValue(data.ExamComments);
                row.CreateCell(76).SetCellValue(data.PicturesComments);
                row.CreateCell(77).SetCellValue(data.MeasurementsComments);
                row.CreateCell(78).SetCellValue(data.MissingPartsComments);
                row.CreateCell(79).SetCellValue(data.StomachContents);
                row.CreateCell(80).SetCellValue(data.OtherSamplesComments);
                row.CreateCell(81).SetCellValue(data.SamplesComments);
                row.CreateCell(82).SetCellValue(data.GeneralComments);
                rowIndex++;
            }

            var directoryName = Path.Combine(Path.GetTempPath(), "WMIS");
            string strFile = "Necropsy_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
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
            public int Create([FromBody] WolfNecropsy wnn)
            {
                return Repository.WolfNecropsyCreate(wnn, _user.Username);
            }
  

        [HttpPut]
        [Route]
        [WmisWebApiAuthorize(Roles = WmisRoles.WMISDiseaseAdministrator)]
        public DateTime Update([FromBody] WolfNecropsy wn)
        {
            return Repository.WolfNecropsyUpdate(wn, _user.Username);
        }

        [HttpPost]
        [Route("upload")]
        [IFrameProgressExceptionHandler(WolfNecropsyBulkUploadErrorString)]
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
                Repository.AddBulkUploadNecropsies(originalFile.Name, destinationFilePath, "Necropsy", destinationFile);

                // now merge the data to the database
                var data = new WolfNecropsyBulkUploaderService().GetData(destinationFilePath, 1);
                //Test to see if it reached here
                // System.Web.HttpContext.Current.Response.Write("Data is about to be inserted");
                 Repository.BulkInsertNecropsies(data);

                // send the response back to EventListener
                var pageBuilder = new StringBuilder();
                pageBuilder.Append("<html><head></head>");
                pageBuilder.Append(String.Format("<body><script type='text/javascript'>parent.postMessage('{0}:{{1}}', '*');</script></body></html>", WolfNecropsyBulkUploadString));
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
        public Dto.PagedResultset<Models.NecropsyBulkUploads> GetNecropsyBulkUploads([FromUri] Dto.PagedDataKeywordRequest str)
        {
            return Repository.WolfNecropsyBulkUploadsGet(str ?? new Dto.PagedDataKeywordRequest());
        }


        [HttpDelete]
        [Route("Necropsy/{CaseId:int}/delete")]
        [WmisWebApiAuthorize(Roles = WmisRoles.WMISDiseaseAdministrator)]
        public void DeleteNecropsies(int caseId)
        {
            Repository.WolfNecropsyDelete(caseId);
        }

    }
}