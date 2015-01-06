namespace Wmis.ApiControllers
{
	using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

	[RoutePrefix("api/file")]
	public class FileApiController : BaseApiController
	{
		public FileApiController(WebConfiguration config)
			: base(config)
		{
		}

		[HttpGet]
        [Route]
		public PagedResultset<File> GetCollaredAnimalFiles([FromUri]FileSearchRequest request)
		{
            return Repository.FileSearch(request);
		}

		[HttpPost]
		[Route]
		public void UpdateFile([FromBody]FileUpdateRequest request)
		{
			Repository.FileUpdate(request);
		}

		[HttpPut]
		[Route]
		public void CreateFile([FromBody]FileCreateRequest request)
		{
			Repository.FileCreate(request);
		}

		[HttpDelete]
		[Route("{key:int}")]
		public void DeleteFile(int key)
		{
			Repository.FileDelete(key);
		}
	}
}
