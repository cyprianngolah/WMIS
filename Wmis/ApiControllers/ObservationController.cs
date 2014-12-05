namespace Wmis.ApiControllers
{
	using System;
	using System.Linq;
	using System.Net.Http;
	using System.Threading.Tasks;
	using System.Web.Http;

	using Wmis.Configuration;

	[RoutePrefix("api/observation")]
	public class ObservationController : BaseApiController
    {
		public ObservationController(WebConfiguration config) 
			: base(config)
		{
		}

		[HttpPost]
		[Route("upload/{projectKey:int?}")]
		public async Task<Dto.ObservationUploadResponse> Upload(int projectKey)
		{
			var folder = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];
			var streamProvider = new MultipartFormDataStreamProvider(folder);

			try
			{
				await Request.Content.ReadAsMultipartAsync(streamProvider);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex);
			}

			return new Dto.ObservationUploadResponse
				       {
					       Filenames = streamProvider.FileData.Select(fd => fd.LocalFileName)
				       };
		}
    }
}
