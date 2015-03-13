using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Wmis.ApiControllers
{
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
        public Dto.PagedResultset<Models.Site> GetSite(int siteKey)
        {
            return Repository.SiteGet(siteKey);
        }

        [HttpPost]
        [Route]
        public void CreateSite([FromUri]SiteSaveRequest request)
        {
            Repository.SiteSave(request ?? new SiteSaveRequest());
        }
    }
}
