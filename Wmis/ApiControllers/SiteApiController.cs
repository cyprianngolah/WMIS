namespace Wmis.ApiControllers
{
    using System.Web.Http;

    using Wmis.Configuration;
    using Wmis.Dto;
    using Wmis.Models;

    [RoutePrefix("api/site")]
    public class SiteApiController : BaseApiController
    {
        public SiteApiController(WebConfiguration config)
            : base(config)
        {
        }

        [HttpGet]
        [Route("{siteKey:int}")]
        public PagedResultset<Site> GetSite(int siteKey)
        {
            return Repository.SiteGet(new SiteRequest() {Key = siteKey});
        }

        [HttpGet]
        [Route]
        public PagedResultset<Site> Get([FromUri]SiteRequest searchRequestParameters)
        {
            return Repository.SiteGet(searchRequestParameters);
        }

        [HttpPost]
        [Route]
        public void SaveSite([FromBody]SiteSaveRequest request)
        {
            Repository.SiteSave(request ?? new SiteSaveRequest());
        }
    }
}
