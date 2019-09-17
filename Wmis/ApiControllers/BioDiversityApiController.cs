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


    /// <summary>
	/// Bio Diversity API Controller
	/// </summary>
	[RoutePrefix("api/biodiversity")]
    public class BioDiversityController : BaseApiController
    {
        private readonly Auth.WmisUser _user;
        public const string BiodiversityBulkUploadErrorString = "BiodiversityBulkUploadError";
        public const string BiodiversityBulkUploadString = "BiodiversityBulkUpload";
        public const string DownloadErrorString = "FileDownloadError";

        public BioDiversityController(WebConfiguration config, Auth.WmisUser user)
            : base(config)
        {
            _user = user;
        }

        /// <summary>
        /// Gets the list of BioDiversity information based on the searchRequestParameters
        /// </summary>
        /// <param name="searchRequestParameters">The parameters used when searching for BioDiversity data</param>
        /// <returns>The paged data for BioDiversity</returns>
        [HttpGet]
        [Route]
        public BiodiversityPagedResultset Get([FromUri]BioDiversitySearchRequest searchRequestParameters)
        {
            return Repository.BioDiversityGet(searchRequestParameters);
        }

        /// <summary>
        /// Download list of Species depending on the filters passed to the diaplay list
        /// 
        /// </summary>
        /// <param name="bioDiversityKey"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("download")]
        public HttpResponseMessage Download([FromUri]BioDiversitySearchRequest sr)
        {
            var lstData = Repository.BioDiversityGet(sr);

            var workbook = new HSSFWorkbook();
            var sheet = workbook.CreateSheet("Species");

            var header = sheet.CreateRow(0);

            header.CreateCell(0).SetCellValue("Group");
            header.CreateCell(1).SetCellValue("Kingdom");
            header.CreateCell(2).SetCellValue("Phylum");
           // header.CreateCell(3).SetCellValue("SubPhylum");
            header.CreateCell(4).SetCellValue("Class");
            header.CreateCell(5).SetCellValue("Order");
            header.CreateCell(6).SetCellValue("Family");
            header.CreateCell(7).SetCellValue("Common Name");
            header.CreateCell(8).SetCellValue("Name");
            header.CreateCell(9).SetCellValue("Status Rank");
            header.CreateCell(10).SetCellValue("Elcode");
            header.CreateCell(11).SetCellValue("NonNTSpecies");
            header.CreateCell(12).SetCellValue("Canada Known SubSpecies Count");
            header.CreateCell(13).SetCellValue("Canada Known SubSpecies Description");
            header.CreateCell(14).SetCellValue("NWT Known SubSpecies Count");
            header.CreateCell(15).SetCellValue("NWT Known SubSpecies Description");
            header.CreateCell(16).SetCellValue("Age of Maturity");
            header.CreateCell(16).SetCellValue("Age of Maturity Description");
            header.CreateCell(17).SetCellValue("Reproduction Frequency Per Year");
            header.CreateCell(18).SetCellValue("Reproduction Frequency Per Year Description");
            header.CreateCell(18).SetCellValue("Longevity");
            header.CreateCell(19).SetCellValue("Longevity Description");
            header.CreateCell(20).SetCellValue("Vegetation Reproduction Description");
            header.CreateCell(21).SetCellValue("HostFish Description");
            header.CreateCell(22).SetCellValue("Other Reproduction Description");
            header.CreateCell(23).SetCellValue("Ecozone Description");
            header.CreateCell(24).SetCellValue("Ecoregion Description");
            header.CreateCell(25).SetCellValue("Protected Area Description");
            header.CreateCell(26).SetCellValue("Range Extent Score");
            header.CreateCell(27).SetCellValue("Range Extent Description");
            header.CreateCell(28).SetCellValue("Distribution Percentage");
            header.CreateCell(29).SetCellValue("Area Of Occupancy Score");
            header.CreateCell(30).SetCellValue("Area Of Occupancy Description");
            header.CreateCell(31).SetCellValue("Historical Distribution Description");
            header.CreateCell(32).SetCellValue("Marine Distribution Description");
            header.CreateCell(33).SetCellValue("Winter Distribution Description");
            header.CreateCell(34).SetCellValue("Habitat Description");
            header.CreateCell(35).SetCellValue("Environmental Specificity Score");
            header.CreateCell(36).SetCellValue("Environmental Specificity Description");
            header.CreateCell(37).SetCellValue("Population Size Score");
            header.CreateCell(38).SetCellValue("Population Size Description");
            header.CreateCell(39).SetCellValue("Number Of Occurences Score");
            header.CreateCell(40).SetCellValue("Number Of Occurences Description");
            header.CreateCell(41).SetCellValue("Density Description");
            header.CreateCell(42).SetCellValue("Threats Score");
            header.CreateCell(43).SetCellValue("Threats Description");
            header.CreateCell(44).SetCellValue("Intrinsic Vulnerability Score");
            header.CreateCell(45).SetCellValue("Intrinsic Vulnerability Description");
            header.CreateCell(46).SetCellValue("Short Term Trends Score");
            header.CreateCell(47).SetCellValue("Short Term Trends Description");
            header.CreateCell(48).SetCellValue("Long Term Trends Score");
            header.CreateCell(49).SetCellValue("Long Term Trends Description");
            header.CreateCell(50).SetCellValue("Status RankDescription");
            header.CreateCell(52).SetCellValue("SRank");
            header.CreateCell(53).SetCellValue("Decision Process Description");
            header.CreateCell(54).SetCellValue("Economic Status Description");
            header.CreateCell(55).SetCellValue("Cosewic Status Description");
            header.CreateCell(56).SetCellValue("Cosewic Status");
            header.CreateCell(57).SetCellValue("NRank");
            header.CreateCell(58).SetCellValue("Federal Species At Risk Status Description");
            header.CreateCell(59).SetCellValue("NWT SARC Assessment Description");
            header.CreateCell(60).SetCellValue("IUCN Status");
            header.CreateCell(61).SetCellValue("IUCN Description");
            header.CreateCell(62).SetCellValue("GRank");
            header.CreateCell(63).SetCellValue("SARA Status");
            header.CreateCell(64).SetCellValue("NWT Status Rank");
            header.CreateCell(65).SetCellValue("Last Updated");

            var rowIndex = 1;

            foreach (var data in lstData.Data)
            {
                var row = sheet.CreateRow(rowIndex);
                row.CreateCell(0).SetCellValue(data.Group.Name);
                row.CreateCell(1).SetCellValue(data.Kingdom.Name);
                row.CreateCell(2).SetCellValue(data.Phylum.Name);
               // row.CreateCell(3).SetCellValue(data.SubPhylum.Name);
                row.CreateCell(4).SetCellValue(data.Class.Name);
                row.CreateCell(5).SetCellValue(data.Order.Name);
                row.CreateCell(6).SetCellValue(data.Family.Name);
                row.CreateCell(7).SetCellValue(data.CommonName);
                row.CreateCell(8).SetCellValue(data.Name);
                row.CreateCell(9).SetCellValue(data.StatusRank.Name);
                row.CreateCell(10).SetCellValue(data.Elcode);
                row.CreateCell(11).SetCellValue(data.NonNtSpecies.ToString());
                row.CreateCell(12).SetCellValue(data.CanadaKnownSubSpeciesCount.ToString());
                row.CreateCell(13).SetCellValue(data.CanadaKnownSubSpeciesDescription);
                row.CreateCell(14).SetCellValue(data.NwtKnownSubSpeciesCount.ToString());
                row.CreateCell(15).SetCellValue(data.NwtKnownSubSpeciesDescription);
                row.CreateCell(16).SetCellValue(data.AgeOfMaturity.ToString());
                row.CreateCell(16).SetCellValue(data.AgeOfMaturityDescription);
                row.CreateCell(17).SetCellValue(data.ReproductionFrequencyPerYear.ToString());
                row.CreateCell(18).SetCellValue(data.ReproductionFrequencyPerYearDescription);
                row.CreateCell(18).SetCellValue(data.Longevity.ToString());
                row.CreateCell(19).SetCellValue(data.LongevityDescription);
                row.CreateCell(20).SetCellValue(data.VegetationReproductionDescription);
                row.CreateCell(21).SetCellValue(data.HostFishDescription);
                row.CreateCell(22).SetCellValue(data.OtherReproductionDescription);
                row.CreateCell(23).SetCellValue(data.EcozoneDescription);
                row.CreateCell(24).SetCellValue(data.EcoregionDescription);
                row.CreateCell(25).SetCellValue(data.ProtectedAreaDescription);
                row.CreateCell(26).SetCellValue(data.RangeExtentScore);
                row.CreateCell(27).SetCellValue(data.RangeExtentDescription);
                row.CreateCell(28).SetCellValue(data.DistributionPercentage);
                row.CreateCell(29).SetCellValue(data.AreaOfOccupancyScore);
                row.CreateCell(30).SetCellValue(data.AreaOfOccupancyDescription);
                row.CreateCell(31).SetCellValue(data.HistoricalDistributionDescription);
                row.CreateCell(32).SetCellValue(data.MarineDistributionDescription);
                row.CreateCell(33).SetCellValue(data.WinterDistributionDescription);
                row.CreateCell(34).SetCellValue(data.HabitatDescription);
                row.CreateCell(35).SetCellValue(data.EnvironmentalSpecificityScore);
                row.CreateCell(36).SetCellValue(data.EnvironmentalSpecificityDescription);
                row.CreateCell(37).SetCellValue(data.PopulationSizeScore);
                row.CreateCell(38).SetCellValue(data.PopulationSizeDescription);
                row.CreateCell(39).SetCellValue(data.NumberOfOccurencesScore);
                row.CreateCell(40).SetCellValue(data.NumberOfOccurencesDescription);
                row.CreateCell(41).SetCellValue(data.DensityDescription);
                row.CreateCell(42).SetCellValue(data.ThreatsScore);
                row.CreateCell(43).SetCellValue(data.ThreatsDescription);
                row.CreateCell(44).SetCellValue(data.IntrinsicVulnerabilityScore);
                row.CreateCell(45).SetCellValue(data.IntrinsicVulnerabilityDescription);
                row.CreateCell(46).SetCellValue(data.ShortTermTrendsScore);
                row.CreateCell(47).SetCellValue(data.ShortTermTrendsDescription);
                row.CreateCell(48).SetCellValue(data.LongTermTrendsScore);
                row.CreateCell(49).SetCellValue(data.LongTermTrendsDescription);
                row.CreateCell(50).SetCellValue(data.StatusRankDescription);
                row.CreateCell(52).SetCellValue(data.SRank);
                row.CreateCell(53).SetCellValue(data.DecisionProcessDescription);
                row.CreateCell(54).SetCellValue(data.EconomicStatusDescription);
                row.CreateCell(55).SetCellValue(data.CosewicStatusDescription);
                row.CreateCell(56).SetCellValue(data.CosewicStatus.Name);
                row.CreateCell(57).SetCellValue(data.NRank);
                row.CreateCell(58).SetCellValue(data.FederalSpeciesAtRiskStatusDescription);
                row.CreateCell(59).SetCellValue(data.NwtsarcAssessmentDescription);
                row.CreateCell(60).SetCellValue(data.IucnStatus);
                row.CreateCell(61).SetCellValue(data.IucnDescription);
                row.CreateCell(62).SetCellValue(data.GRank);
                row.CreateCell(63).SetCellValue(data.SaraStatus.Name);
                row.CreateCell(64).SetCellValue(data.NwtStatusRank.Name);
                row.CreateCell(65).SetCellValue(data.LastUpdated.ToString());

                rowIndex++;
            }

            var directoryName = Path.Combine(Path.GetTempPath(), "WMIS");
            string strFile = "Species_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
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
        [Route("{bioDiversityKey:int?}")]
        public BioDiversity Get(int bioDiversityKey)
        {
            return Repository.BioDiversityGet(bioDiversityKey);
        }

        [HttpGet]
        [Route("all")]
        public IEnumerable<BioDiversity> Get()
        {
            return Repository.BioDiversityGetAll();
        }

        [HttpPost]
        [Route]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity)]
        public int Create([FromBody]BioDiversityNew bdn)
        {
            return Repository.BioDiversityCreate(bdn, _user.Username);
        }

        [HttpPut]
        [Route]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity)]
        public DateTime Update([FromBody]BioDiversity bd)
        {
            return Repository.BioDiversityUpdate(bd, _user.Username);
        }

        [HttpGet]
        [Route("decision/{bioDiversityKey:int?}")]
        public BioDiversityDecisionRequest BioDiversityDecisionGet(int bioDiversityKey)
        {
            var bioDiversity = Repository.BioDiversityGet(bioDiversityKey);
            return new BioDiversityDecisionRequest
            {
                Key = bioDiversity.Key,
                Name = bioDiversity.Name,
                CommonName = bioDiversity.CommonName,
                SubSpeciesName = bioDiversity.SubSpeciesName,
                EcoType = bioDiversity.EcoType,
                LastUpdated = bioDiversity.LastUpdated,
                RangeExtentScore = bioDiversity.RangeExtentScore,
                RangeExtentDescription = bioDiversity.RangeExtentDescription,
                AreaOfOccupancyScore = bioDiversity.AreaOfOccupancyScore,
                AreaOfOccupancyDescription = bioDiversity.AreaOfOccupancyDescription,
                PopulationSizeScore = bioDiversity.PopulationSizeScore,
                PopulationSizeDescription = bioDiversity.PopulationSizeDescription,
                NumberOfOccurencesScore = bioDiversity.NumberOfOccurencesScore,
                NumberOfOccurencesDescription = bioDiversity.NumberOfOccurencesDescription,
                EnvironmentalSpecificityScore = bioDiversity.EnvironmentalSpecificityScore,
                EnvironmentalSpecificityDescription = bioDiversity.EnvironmentalSpecificityDescription,
                ShortTermTrendsScore = bioDiversity.ShortTermTrendsScore,
                ShortTermTrendsDescription = bioDiversity.ShortTermTrendsDescription,
                LongTermTrendsScore = bioDiversity.LongTermTrendsScore,
                LongTermTrendsDescription = bioDiversity.LongTermTrendsDescription,
                ThreatsScore = bioDiversity.ThreatsScore,
                ThreatsDescription = bioDiversity.ThreatsDescription,
                IntrinsicVulnerabilityScore = bioDiversity.IntrinsicVulnerabilityScore,
                IntrinsicVulnerabilityDescription = bioDiversity.IntrinsicVulnerabilityDescription,
                NwtStatusRank = bioDiversity.NwtStatusRank,
                SRank = bioDiversity.SRank,
                StatusRank = bioDiversity.StatusRank,
                StatusRankDescription = bioDiversity.StatusRankDescription,
                DecisionProcessDescription = bioDiversity.DecisionProcessDescription,
                NwtSarcAssessment = bioDiversity.NwtSarcAssessment,
                CosewicStatus = bioDiversity.CosewicStatus,
                NRank = bioDiversity.NRank,
                SaraStatus = bioDiversity.SaraStatus,
                IucnStatus = bioDiversity.IucnStatus,
                GRank = bioDiversity.GRank,
                Populations = bioDiversity.Populations
            };
        }

        [HttpPut]
        [Route("decision")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity)]
        public void BioDiversityDecisionUpdate([FromBody]BioDiversityDecisionRequest request)
        {

            var bioDiversity = Repository.BioDiversityGet(request.Key);
            bioDiversity.RangeExtentScore = request.RangeExtentScore;
            bioDiversity.RangeExtentDescription = request.RangeExtentDescription;
            bioDiversity.AreaOfOccupancyScore = request.AreaOfOccupancyScore;
            bioDiversity.AreaOfOccupancyDescription = request.AreaOfOccupancyDescription;
            bioDiversity.PopulationSizeScore = request.PopulationSizeScore;
            bioDiversity.PopulationSizeDescription = request.PopulationSizeDescription;
            bioDiversity.NumberOfOccurencesScore = request.NumberOfOccurencesScore;
            bioDiversity.NumberOfOccurencesDescription = request.NumberOfOccurencesDescription;
            bioDiversity.EnvironmentalSpecificityScore = request.EnvironmentalSpecificityScore;
            bioDiversity.EnvironmentalSpecificityDescription = request.EnvironmentalSpecificityDescription;
            bioDiversity.ShortTermTrendsScore = request.ShortTermTrendsScore;
            bioDiversity.ShortTermTrendsDescription = request.ShortTermTrendsDescription;
            bioDiversity.LongTermTrendsScore = request.LongTermTrendsScore;
            bioDiversity.LongTermTrendsDescription = request.LongTermTrendsDescription;
            bioDiversity.ThreatsScore = request.ThreatsScore;
            bioDiversity.ThreatsDescription = request.ThreatsDescription;
            bioDiversity.IntrinsicVulnerabilityScore = request.IntrinsicVulnerabilityScore;
            bioDiversity.IntrinsicVulnerabilityDescription = request.IntrinsicVulnerabilityDescription;
            bioDiversity.StatusRank = request.StatusRank;
            bioDiversity.SRank = request.SRank;
            bioDiversity.StatusRankDescription = request.StatusRankDescription;
            bioDiversity.DecisionProcessDescription = request.DecisionProcessDescription;
            bioDiversity.NwtSarcAssessment = request.NwtSarcAssessment;
            bioDiversity.CosewicStatus = request.CosewicStatus;
            bioDiversity.NRank = request.NRank;
            bioDiversity.SaraStatus = request.SaraStatus;
            bioDiversity.IucnStatus = request.IucnStatus;
            bioDiversity.GRank = request.GRank;
            Repository.BioDiversityUpdate(bioDiversity, _user.Username);
        }

        [HttpGet]
        [Route("species")]
        public Dto.PagedResultset<Models.SpeciesType> SpeciesGet([FromUri]Dto.SpeciesTypeRequest psr)
        {
            var species = Repository.TargetSpeciesGet(psr);
            return species;
        }

        [HttpGet]
        [Route("nwtSaraStatuses")]
        public PagedResultset<SaraStatus> NwtSaraStatusGet([FromUri]SaraStatusRequest request)
        {
            return Repository.SaraStatusGet(request);
        }

        [HttpGet]
        [Route("fedSaraStatuses")]
        public PagedResultset<SaraStatus> FedSaraStatusGet([FromUri]SaraStatusRequest request)
        {
            return Repository.SaraStatusGet(request);
        }

        [HttpGet]
        [Route("statusRanks")]
        public PagedResultset<StatusRank> GeneralRankGet([FromUri]StatusRankRequest request)
        {
            return Repository.StatusRankGet(request);
        }

        [HttpGet]
        [Route("nwtSarcAssessments")]
        public PagedResultset<NwtSarcAssessment> NwtSarcAssessmentGet([FromUri]NwtSarcAssessmentRequest request)
        {
            return Repository.NwtSarcAssessmentGet(request);
        }

        [HttpGet]
        [Route("surveyTypes")]
        public PagedResultset<SurveyType> SurveyTypeGet([FromUri]SurveyTypeRequest request)
        {
            return Repository.SurveyTypeSearch(request);
        }

        #region Synonym Various

        /// <summary>
        /// Gets the SpeciesSynonyms for the given Species
        /// </summary>
        /// <param name="speciesKey">Species to retrieve</param>
        /// <returns>The list of matching TaxonomySynonyms</returns>
        [HttpGet]
        [Route("synonym/{speciesKey:int}")]
        public SpeciesSynonymRequest GetSynonyms(int speciesKey)
        {
            var speciesSynonyms = Repository.SpeciesSynonymGet(speciesKey);
            var synonymsDictionary = speciesSynonyms.GroupBy(s => s.SpeciesSynonymTypeId)
                .ToDictionary(g => g.Key, g => g.ToList().Select(s => s.Name));
            return new SpeciesSynonymRequest { SpeciesId = speciesKey, SynonymsDictionary = synonymsDictionary };
        }

        /// <summary>
        /// Save synonyms for a Species / Species Synonym Type
        /// </summary>
        /// <param name="sssr">Synonyms to save</param>
        [HttpPost]
        [Route("synonym/save")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity)]
        public void SaveSynonyms([FromBody]Dto.SpeciesSynonymSaveRequest sssr)
        {
            Repository.SpeciesSynonymSaveMany(sssr.SpeciesId, sssr.SpeciesSynonymTypeId, sssr.Synonyms.Where(i => !string.IsNullOrWhiteSpace(i)));
        }
        #endregion

        [HttpPost]
        [Route("upload")]
        [IFrameProgressExceptionHandler(BiodiversityBulkUploadErrorString)]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity)]
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
                Repository.AddBulkUpload(originalFile.Name, destinationFilePath, "Species", destinationFile);

                // now merge the data to the database
                var data = new BiodiversityBulkUploaderService().GetData(destinationFilePath, 1);
                //Test to see if it reached here
               // System.Web.HttpContext.Current.Response.Write("Data is about to be inserted");
                Repository.BulkInsertSpecies(data);

                // send the response back to EventListener
                var pageBuilder = new StringBuilder();
                pageBuilder.Append("<html><head></head>");
                pageBuilder.Append(String.Format("<body><script type='text/javascript'>parent.postMessage('{0}:{{1}}', '*');</script></body></html>", BiodiversityBulkUploadString));
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
        public Dto.PagedResultset<Models.BulkUploads> GetBulkUploads([FromUri]Dto.PagedDataKeywordRequest str)
        {
            return Repository.BiodiversityBulkUploadsGet(str ?? new Dto.PagedDataKeywordRequest());
        }


        [HttpDelete]
        [Route("species/{speciesId:int}/delete")]
        [WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity)]
        public void DeleteSpecies(int speciesId)
        {
            Repository.BiodiversityDelete(speciesId);
        }


    }
}
