namespace Wmis.ApiControllers
{
    using System.Collections.Generic;
    using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

	/// <summary>
	/// Collar API Controller
	/// </summary>
	[RoutePrefix("api/history")]
	public class HistoryLogApiController : BaseApiController
    {
        public HistoryLogApiController(WebConfiguration config) 
			: base(config)
		{
		}

        [HttpGet]
        [Route]
        public PagedResultset<HistoryLog> GetHistoryLogs([FromUri]Dto.HistoryLogSearchRequest request)
        {
            if (request == null)
            {
                request = new HistoryLogSearchRequest();
            }

            return Repository.HistoryLogSearch(request);
        }

        [HttpPost]
        [Route]
        public void Update([FromBody]HistoryLog historyLog)
        {
            Repository.HistoryLogSave(historyLog);
        }

        [HttpGet]
        [Route("filterTypes")]
        public IEnumerable<Models.HistoricTypesFilter> GetHistoricTypeFilters([FromUri]Dto.HistoricFilterTypeRequest hftp)
        {
            return Repository.HistoricFilerTypesSearch(hftp ?? new HistoricFilterTypeRequest());
        }
    }
}
