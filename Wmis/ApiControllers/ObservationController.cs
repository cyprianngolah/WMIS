namespace Wmis.ApiControllers
{
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;
	using System.Net;
	using System.Net.Http;
	using System.Text;
	using System.Threading.Tasks;
	using System.Web.Http;

	using Wmis.Configuration;
	using Wmis.Logic;
	using Wmis.Models;
	using Wmis.WebApi;

	using File = System.IO.File;

	public class ObservationUploadException : Exception
	{
		public ObservationUploadException(string message)
			: base(message)
		{
		}
	}

	[RoutePrefix("api/observation")]
	public class ObservationController : BaseApiController
	{
		public const string ObservationUploadString = "observationUpload";
		public const string ObservationUploadErrorString = "observationUploadError";

		public ObservationController(WebConfiguration config) 
			: base(config)
		{
		}

		[HttpPost]
		[Route("upload/{projectKey:int?}")]
		[IFrameProgressExceptionHandler(ObservationUploadErrorString)]
		public async Task<HttpResponseMessage> Upload(int projectKey)
		{
			// Save the File to a Temporary path (generally C:/Temp
			var uploadPath = Path.Combine(Path.GetTempPath(), "WMIS");
			if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
			var streamProvider = new MultipartFormDataStreamProvider(uploadPath);
			await Request.Content.ReadAsMultipartAsync(streamProvider);

			FileInfo tempFile = null;
			try
			{
				// Move the file to a location specified in the ObservationFileSaveDirectory AppSetting 
				var destinationFolder = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];

				var tempFileData = streamProvider.FileData.First();
				tempFile = new FileInfo(tempFileData.LocalFileName);
				var originalFile = new FileInfo(tempFileData.Headers.ContentDisposition.FileName.Replace("\"", ""));
				if (!originalFile.Extension.Contains("xls"))
				{
					throw new ObservationUploadException("Invalid File Extension. Observation Upload only supports .xls or .xlsx extensions.");
				}
				var destinationFile = String.Concat(Guid.NewGuid(), originalFile.Extension);
				var destinationFilePath = Path.Combine(destinationFolder, destinationFile);
				File.Copy(tempFileData.LocalFileName, destinationFilePath);

				// Save the Observation Upload Status to the database
				var observationUploadKey = Repository.InsertObservationUpload(projectKey, originalFile.Name, destinationFilePath);

				// Send the Response back
				var pageBuilder = new StringBuilder();
				pageBuilder.Append("<html><head></head>");
				pageBuilder.Append(String.Format("<body><script type='text/javascript'>parent.postMessage('{0}:{1}', '*');</script></body></html>", ObservationUploadString, observationUploadKey));
				return Request.CreateResponse(HttpStatusCode.OK, pageBuilder.ToString(), new PlainTextFormatter());
			}
			finally
			{
				if (tempFile != null && tempFile.Exists)
				{
					try
					{
						tempFile.Delete();
					}
					catch
					{
					}
				}
			}
		}

		[HttpPut]
		[Route("upload/")]
		public void UpdateObservationUpload([FromBody]ObservationUpload upload)
		{
			Repository.UpdateObservationUpload(upload);
		}

		[HttpGet]
		[Route("project/{projectKey:int?}")]
		public IEnumerable<ObservationUpload> GetUploadsForProject(int projectKey)
		{
			return Repository.GetObservationUploads(projectKey, null);
		}

		[HttpGet]
		[Route("upload/{uploadKey:int?}")]
		public ObservationUpload GetObservationUpload(int uploadKey)
		{
			return Repository.GetObservationUploads(null, uploadKey).Single();
		}

		[HttpGet]
		[Route("{uploadKey:int?}/rows")]
		public IEnumerable<ObservationRow> GetFirstRows(int uploadKey)
		{
			var ops = new ObservationParserService(WebConfiguration);
			var destinationFolder = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];
			var upload = Repository.GetObservationUploads(null, uploadKey).Single();
			var filePath = Path.Combine(destinationFolder, upload.FilePath);

			return ops.GetFirstRows(10, filePath);
		}

		[HttpGet]
		[Route("upload/{uploadKey:int?}/columns")]
		public IEnumerable<SurveyTemplateColumn> GetObservationUploadTemplateColumns(int uploadKey)
		{
			return Repository.GetSurveyTemplateColumns(uploadKey);
		}
    }
}
