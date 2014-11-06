namespace Wmis.ApiControllers
{
	using System;
	using System.Linq;
    using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

	/// <summary>
	/// Collar API Controller
	/// </summary>
	[RoutePrefix("api/collar")]
	public class CollarController : BaseApiController
    {
		public CollarController(WebConfiguration config) 
			: base(config)
		{
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
		[Route("{collarKey:int?}")]
		public Collar CollarGet(int collarKey)
		{
			return Repository.CollarGet(collarKey);
		}

		[HttpPost]
		[Route]
		public int Create([FromBody]string name)
		{
			return Repository.CollarCreate(name);
		}

		[HttpPut]
		[Route]
		public void Update([FromBody]Collar collar)
		{
			Repository.CollarUpdate(collar);
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
        [Route("history")]
        public PagedResultset<CollarHistory> GetCollarHistory([FromUri]Dto.CollarHistoryRequest chr)
        {
            if (chr == null)
            {
                chr = new CollarHistoryRequest();
            }

            return Repository.CollarHistorySearch(chr);
        }

        [HttpPut]
        [Route("history")]
        public void Update([FromBody]CollarHistory collarHistory)
        {
            Repository.CollarHistorySave(collarHistory);
        }

    }
}
