namespace Wmis.ApiControllers
{
    using System.Web.Http;

    using Wmis.Configuration;
    using Wmis.Dto;
    using Wmis.Models;

    [RoutePrefix("api/search")]
    public class SearchApiController : BaseApiController
    {
        public SearchApiController(WebConfiguration config)
            : base(config)
        {
        }

        [HttpGet]
        [Route]
        public PagedResultset<SearchResponse> Get([FromUri]SearchRequest searchRequestParameters)
        {
            return Repository.Search(searchRequestParameters);
        }
    }
}
