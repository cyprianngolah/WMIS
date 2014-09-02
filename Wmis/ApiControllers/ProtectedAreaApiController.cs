﻿namespace Wmis.ApiControllers
{
	using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

	[RoutePrefix("api/protectedarea")]
	public class ProtectedAreaApiController : BaseApiController
    {
		public ProtectedAreaApiController(WebConfiguration config) 
			: base(config)
		{
		}

		/// <summary>
		/// Gets all Protected Areas
		/// </summary>
		/// <param name="request">The Protected Areas Request details to filter by</param>
		/// <returns>The list of matching Protected Area objects</returns>
		[HttpGet]
		[Route]
		public PagedResultset<ProtectedArea> GetProtectedAreas([FromUri]ProtectedAreaRequest request)
		{
			return Repository.ProtectedAreaGet(request ?? new ProtectedAreaRequest());
		}
    }
}
