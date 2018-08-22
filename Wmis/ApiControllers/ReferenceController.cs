namespace Wmis.ApiControllers
{
    using System;
    using System.Collections.Generic;
    using System.Web.Http;
	using Configuration;
	using Models;

    using NPOI.HSSF.UserModel;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.IO;
    using System.Net;

    [RoutePrefix("api/references")]
	public class ReferenceController : BaseApiController
    {
		public ReferenceController(WebConfiguration config) 
			: base(config)
		{
		}

		[HttpGet]
		[Route]
		public Dto.PagedResultset<Reference> GetReferences([FromUri]Dto.ReferenceRequest rr)
		{
			return Repository.ReferencesSearch(rr);
		}

        [HttpGet]
        [Route("download")]
        public HttpResponseMessage Download([FromUri]Dto.ReferenceRequest rr)
        {
            var lstData = Repository.ReferencesSearch(rr);

            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet("References");
            var header = sheet.CreateRow(0);
            
            header.CreateCell(0).SetCellValue("ID");
            header.CreateCell(1).SetCellValue("Code");
            header.CreateCell(2).SetCellValue("Author");
            header.CreateCell(3).SetCellValue("Year");
            header.CreateCell(4).SetCellValue("Title");
            header.CreateCell(5).SetCellValue("Edition Publication Organization");
            header.CreateCell(6).SetCellValue("Volume Page");
            header.CreateCell(7).SetCellValue("Publisher");
            header.CreateCell(8).SetCellValue("City");
            header.CreateCell(9).SetCellValue("Location");

            var rowIndex = 1;

            foreach (var data in lstData.Data)
            {
                var row = sheet.CreateRow(rowIndex);
                row.CreateCell(0).SetCellValue(data.Key);
                row.CreateCell(1).SetCellValue(data.Code);
                row.CreateCell(2).SetCellValue(data.Author);
                row.CreateCell(3).SetCellValue(data.Year.ToString());
                row.CreateCell(4).SetCellValue(data.Title);
                row.CreateCell(5).SetCellValue(data.EditionPublicationOrganization);
                row.CreateCell(6).SetCellValue(data.VolumePage);
                row.CreateCell(7).SetCellValue(data.Publisher);
                row.CreateCell(8).SetCellValue(data.City);
                row.CreateCell(9).SetCellValue(data.Location);

                rowIndex++;
            }

            var directoryName = Path.Combine(Path.GetTempPath(), "WMIS");
            string strFile = "References_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
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
		public void SaveReference(Models.Reference r)
		{
			Repository.ReferenceSave(r);
		}

        [HttpGet]
        [Route("years")]
        public IEnumerable<Models.ReferenceYear> GetReferenceYears()
        {
            return Repository.GetReferenceYears();
        }
    }
}
