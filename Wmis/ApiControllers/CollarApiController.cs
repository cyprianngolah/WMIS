namespace Wmis.ApiControllers
{
    using System.Linq;
    using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.IO;
    using NPOI.HSSF.UserModel;
    using System;
    using System.Net;

    /// <summary>
    /// Collar API Controller
    /// </summary>
    [RoutePrefix("api/collar")]
	public class CollarApiController : BaseApiController
    {
        private readonly Auth.WmisUser _user;

        public CollarApiController(WebConfiguration config, Auth.WmisUser user) 
			: base(config)
        {
            _user = user;
		}

		/// <summary>
		/// Gets the list of Collar information based on the searchRequestParameters
		/// </summary>
		/// <param name="searchRequestParameters">The parameters used when searching for Collar data</param>
		/// <returns>The paged data for Collar</returns>
        [HttpGet]
        [Route]
        public PagedResultset<Collar> Get([FromUri]CollarSearchRequest searchRequestParameters)
        {
            return Repository.CollarGet(searchRequestParameters);
        }

        [HttpGet]
        [Route("download")]
        public HttpResponseMessage DownloadCollaredAnimals([FromUri]CollarSearchRequest pr)
        {
            var lstData = Repository.CollarGet(pr);

            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet("Projects");

            var header = sheet.CreateRow(0);
            header.CreateCell(0).SetCellValue("Animal ID");
            header.CreateCell(1).SetCellValue("PTT");
            header.CreateCell(2).SetCellValue("Collar State");
            header.CreateCell(3).SetCellValue("Collar Status");
            header.CreateCell(4).SetCellValue("Inactive Date");
            header.CreateCell(5).SetCellValue("Animal Status");
            header.CreateCell(6).SetCellValue("VHF Frequency");
            header.CreateCell(7).SetCellValue("Sex");
            header.CreateCell(8).SetCellValue("Herd");
            header.CreateCell(9).SetCellValue("Collar Type");
            header.CreateCell(10).SetCellValue("Region");
            header.CreateCell(11).SetCellValue("Job Number");
            header.CreateCell(12).SetCellValue("PTT Returned to CLS");
            header.CreateCell(13).SetCellValue("Geofencing");
            header.CreateCell(14).SetCellValue("Comments");
            header.CreateCell(15).SetCellValue("ReleasedOnSchedule");
            header.CreateCell(16).SetCellValue("ProgrammingSpec");
            var rowIndex = 1;

            foreach (var data in lstData.Data)
            {
                var row = sheet.CreateRow(rowIndex);
                row.CreateCell(0).SetCellValue(data.AnimalId);
                row.CreateCell(1).SetCellValue(data.SubscriptionId);
                row.CreateCell(2).SetCellValue(data.CollarState.Name);
                row.CreateCell(3).SetCellValue(data.CollarStatus.Name);
                row.CreateCell(4).SetCellValue(data.InactiveDate.ToString());
                row.CreateCell(5).SetCellValue(data.AnimalStatus.Name);
                row.CreateCell(6).SetCellValue(data.VhfFrequency);
                row.CreateCell(7).SetCellValue(data.AnimalSex.Name);
                row.CreateCell(8).SetCellValue(data.HerdPopulation.Name);
                row.CreateCell(9).SetCellValue(data.CollarType.Name);
                row.CreateCell(10).SetCellValue(data.CollarRegion.Name);
                row.CreateCell(11).SetCellValue(data.JobNumber);
                row.CreateCell(12).SetCellValue(data.HasPttBeenReturned);
                row.CreateCell(13).SetCellValue(data.Geofencing);
                row.CreateCell(14).SetCellValue(data.Comments);
                row.CreateCell(15).SetCellValue(data.ReleasedOnSchedule);
                row.CreateCell(16).SetCellValue(data.ProgrammingSpec);

                rowIndex++;
            }

            var directoryName = Path.Combine(Path.GetTempPath(), "WMIS");
            string strFile = "CollaredAnimals_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
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
		[Route("{collaredAnimalKey:int?}")]
		public Collar CollarGet(int collaredAnimalKey)
		{
			return Repository.CollarGet(collaredAnimalKey);
		}

		[HttpPost]
		[Route]
		public int Create([FromBody]string name)
		{
            return Repository.CollarCreate(name, _user.Username);
		}

		[HttpPut]
		[Route]
		public void Update([FromBody]Collar collar)
		{
            Repository.CollarUpdate(collar, _user.Username);
		}

        [HttpGet]
        [Route("type")]
        public PagedResultset<CollarType> GetCollarTypes([FromUri]Dto.CollarTypeRequest ctr)
        {
            if (ctr == null)
            {
                ctr = new CollarTypeRequest();
            }

            return Repository.CollarTypeGet(ctr);
        }

        [HttpGet]
        [Route("region")]
        public PagedResultset<CollarRegion> GetCollarRegions([FromUri]Dto.CollarRegionRequest crr)
        {
            if (crr == null)
            {
                crr = new CollarRegionRequest();
            }

            return Repository.CollarRegionGet(crr);
        }

        [HttpGet]
        [Route("state")]
        public PagedResultset<CollarState> GetCollarStates([FromUri]Dto.CollarStateRequest csr)
        {
            if (csr == null)
            {
                csr = new CollarStateRequest();
            }

            return Repository.CollarStateGet(csr);
        }

        [HttpGet]
        [Route("status")]
        public PagedResultset<CollarStatus> GetCollarStatuses([FromUri]Dto.CollarStatusRequest csr)
        {
            if (csr == null)
            {
                csr = new CollarStatusRequest();
            }

            return Repository.CollarStatusGet(csr);
        }

        [HttpGet]
        [Route("malfunction")]
        public PagedResultset<CollarMalfunction> GetCollarMalfunction([FromUri]Dto.CollarMalfunctionRequest cmr)
        {
            if (cmr == null)
            {
                cmr = new CollarMalfunctionRequest();
            }

            return Repository.CollarMalfunctionGet(cmr);
        }
        
        [HttpGet]
        [Route("animalSexes")]
        public PagedResultset<AnimalSex> GetAnimalSex([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.AnimalSexGet(request);
        }

        [HttpGet]
        [Route("breedingStatusMethods")]
        public PagedResultset<BreedingStatusMethod> GetBreedingStatusMethod([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.BreedingStatusMethodGet(request);
        }

        [HttpGet]
        [Route("breedingStatuses")]
        public PagedResultset<BreedingStatus> GetBreedingStatus([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.BreedingStatusGet(request);
        }

        [HttpGet]
        [Route("confidenceLevels")]
        public PagedResultset<ConfidenceLevel> GetConfidenceLevel([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.ConfidenceLevelGet(request);
        }

        [HttpGet]
        [Route("herdAssociationMethods")]
        public PagedResultset<HerdAssociationMethod> GetHerdAssociationMethod([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.HerdAssociationMethodGet(request);
        }

        [HttpGet]
        [Route("herdPopulations")]
        public PagedResultset<HerdPopulation> GetHerdPopulation([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.HerdPopulationGet(request);
        }

        [HttpGet]
        [Route("ageClasses")]
        public PagedResultset<AgeClass> GetAgeClass([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.AgeClassGet(request);
        }

        [HttpGet]
        [Route("animalMortalities")]
        public PagedResultset<AnimalMortality> GetAnimalMortality([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.AnimalMortalityGet(request);
        }

        [HttpGet]
        [Route("animalStatuses")]
        public PagedResultset<AnimalStatus> GetAnimalStatus([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.AnimalStatusGet(request);
        }

        [HttpGet]
        [Route("programs")]
        public PagedResultset<ArgosProgram> GetArgosPrograms([FromUri]Dto.PagedDataRequest request)
        {
            if (request == null)
            {
                request = new PagedDataRequest();
            }

            return Repository.ArgosProgramsGet(request);
        }
    }
}
