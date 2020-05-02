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
    using Wmis.Dto;
    using Wmis.Models;
    using System.Net;
    using System;

    [RoutePrefix("api/WolfNecropsy")]
    public class WolfNecropsyApiController : BaseApiController
    {
        private readonly Auth.WmisUser _user;

        public WolfNecropsyApiController(WebConfiguration config, Auth.WmisUser user)
            : base(config)
        {
            _user = user;
        }

        #region WolfNecropsies
        [HttpGet]
        [Route]
        public Dto.PagedResultset<Models.WolfNecropsy> SearchWolfNecropsys([FromUri]Dto.WolfNecropsyRequest pr)
        {
            return Repository.WolfnecropsySearch(pr);
        }

        [HttpGet]
        [Route("download")]
        public HttpResponseMessage DownloadWolfNecropsys([FromUri]WolfNecropsyRequest pr)
        {
            var lstData = Repository.WolfNecropsyDownload(pr);

            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet("WolfNecropsys");

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
            header.CreateCell(9).SetCellValue("CAgeEstimated");

            var rowIndex = 1;

            foreach (var data in lstData.Data)
            {
                var row = sheet.CreateRow(rowIndex);
                row.CreateCell(0).SetCellValue(data.NecropsyId);
                row.CreateCell(1).SetCellValue(data.CommonName);
                row.CreateCell(2).SetCellValue(data.NecropsyDate.Value);
                row.CreateCell(3).SetCellValue(data.Sex);
                row.CreateCell(4).SetCellValue(data.Location.ToString());
                row.CreateCell(5).SetCellValue(data.GridCell.ToString());
                row.CreateCell(6).SetCellValue(data.DateReceived.Value);
                row.CreateCell(7).SetCellValue(data.DateKilled.Value);
                row.CreateCell(8).SetCellValue(data.AgeClass);
                row.CreateCell(9).SetCellValue(data.AgeEstimated);

                rowIndex++;
            }

            var directoryName = Path.Combine(Path.GetTempPath(), "WMIS");
            string strFile = "WolfNecropsys_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
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

        [HttpGet]
        [Route("{WolfNecropsyKey:int}")]
        public Models.WolfNecropsy GetWolfNecropsy(int WolfNecropsyKey)
        {
            return Repository.WolfNecropsyGet(WolfNecropsyKey);
        }
        
        [HttpPost]
        [Route]
        [WmisWebApiAuthorize(Roles = WmisRoles.WMISDiseaseAdministrator)]
        public int Create([FromBody]string name)
        {
            return Repository.WolfNecropsyCreate(name, this._user.Username);
        }

        [HttpPut]
        [Route]
        public void Update(Models.WolfNecropsy p)
        {
            var repo = WebApi.ObjectFactory.Container.GetInstance<Models.WmisRepository>();
            var person = repo.PersonGet(_user.Username);

            // All administrators can see the sensitive data
            if (person.Roles.Select(r => r.Name).Contains(WmisRoles.WMISDiseaseAdministrator)) // || person.WolfNecropsys.Select(pk => pk.Key).Contains(p.Key))
            {
                Repository.WolfNecropsyUpdate(p, "");
                return;
            }
            var historyItemForCreator = repo.HistoryLogSearch(new HistoryLogSearchRequest { Item = "WolfNecropsy Created", ChangeBy = this._user.Username, Key = p.Key, Table = "WolfNecropsyHistory" }).Data;

            if (historyItemForCreator.Any())
            {
                this.Repository.WolfNecropsyUpdate(p, "");
                return;
            }

            throw new HttpResponseException(HttpStatusCode.Unauthorized);
        } 
        #endregion
    }
}