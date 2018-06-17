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

    /// <summary>
	/// Bio Diversity API Controller
	/// </summary>
	[RoutePrefix("api/biodiversity")]
	public class BioDiversityController : BaseApiController
    {
        private readonly Auth.WmisUser _user;
        public const string BiodiversityBulkUploadErrorString = "BiodiversityBulkUploadError";
        public const string BiodiversityBulkUploadString = "BiodiversityBulkUpload";

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
		[WmisWebApiAuthorize(Roles = WmisRoles.AdministratorBiodiversity )]
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
                Repository.BulkInsertSpecies(data);

                // send the response back to EventListener
                var pageBuilder = new StringBuilder();
                pageBuilder.Append("<html><head></head>");
                pageBuilder.Append(String.Format("<body><script type='text/javascript'>parent.postMessage('{0}:{1}', '*');</script></body></html>", BiodiversityBulkUploadString));
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
        public HttpResponseMessage DownloadFile([FromUri] string fileName)
        {
            /* var destinationFile = fileName;
             var destinationFolder = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];
             var downloadPath = Path.Combine(destinationFolder, destinationFile);
              var response = new FileHttpResponseMessage(downloadPath);
              response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
              {
                  FileName = destinationFile
              };

            return response;*/
            if (!string.IsNullOrEmpty(fileName))
            {
                string filePath = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];
                string fullPath = Path.Combine(filePath, fileName);
                if (System.IO.File.Exists(fullPath))
                {
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    var fileStream = new FileStream(fullPath, FileMode.Open);
                    response.Content = new StreamContent(fileStream);
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = fileName;
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


    }
}
