namespace Wmis.ApiControllers
{
    using System.Web.Http;

    using Wmis.Configuration;
    using Wmis.Dto;
    using Wmis.Models;

    [RoutePrefix("api/help")]
	public class HelpLinkApiController : BaseApiController
    {
        public HelpLinkApiController(WebConfiguration config)
			: base(config)
		{
		}

		[HttpGet]
		[Route]
        public Dto.PagedResultset<HelpLink> GetTemplates([FromUri]HelpLinkRequest str)
		{
            return Repository.HelpLinkSearch(str ?? new HelpLinkRequest());
		}

		[HttpGet]
		[Route("{helpLinkId:int}")]
        public HelpLink GetTemplate(int helpLinkId)
		{
            return Repository.HelpLinkGet(helpLinkId);
		}

        [HttpPost]
        [Route]
        public int Create([FromBody]HelpLinkSaveRequest request)
        {
            return Repository.HelpLinkCreate(request);
        }

        [HttpPut]
        [Route]
        public int Update([FromBody]HelpLink request)
        {
            return Repository.HelpLinkUpdate(request);
        }

        [HttpDelete]
        [Route]
        [Route("{helpLinkId:int}")]
        public int Delete(int helpLinkId)
        {
            return Repository.HelpLinkDelete(helpLinkId);
        }
    }
}
