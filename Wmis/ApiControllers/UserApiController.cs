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

    [RoutePrefix("api/user")]
    public class UserApiController : BaseApiController
    {

        public UserApiController(WebConfiguration config)
			: base(config)
		{
		}

        [HttpGet]
        [Route("{userId:int?}")]
        public User GetUser(int userId)
        {
            return Repository.UserGet(userId);
        }

        [HttpGet]
        [Route]
        public PagedResultset<User> GetUsers([FromUri]PagedDataKeywordRequest request)
        {
            return Repository.UserSearch(request ?? new PagedDataKeywordRequest());
        }

        [HttpPost]
        [Route]
        public int Create([FromBody]UserNew un)
        {
            return Repository.UserCreate(un);
        }

        [HttpPut]
        [Route]
        public void Update([FromBody]User u)
        {
            Repository.UserUpdate(u);
        }
    }
}
