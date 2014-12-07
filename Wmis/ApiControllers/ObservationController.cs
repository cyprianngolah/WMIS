﻿namespace Wmis.ApiControllers
{
	using System;
	using System.Collections;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;
	using System.Net;
	using System.Net.Http;
	using System.Text;
	using System.Threading;
	using System.Threading.Tasks;
	using System.Web.Http;

	using Wmis.Configuration;
	using Wmis.Logic;
	using Wmis.WebApi;

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

		public ObservationController(WebConfiguration config) 
			: base(config)
		{
		}

		[HttpPost]
		[Route("upload/{projectKey:int?}")]
		[IFrameProgressExceptionHandler(ObservationUploadString)]
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
				var fileExtension = new FileInfo(tempFileData.Headers.ContentDisposition.FileName.Replace("\"", "")).Extension;
				if (!fileExtension.Contains("xls"))
				{
					throw new ObservationUploadException("Invalid File Extension. Observation Upload only supports .xls or .xlsx extensions.");
				}
				var destinationFile = String.Concat(Guid.NewGuid(), fileExtension);
				File.Copy(tempFileData.LocalFileName, Path.Combine(destinationFolder, destinationFile));

				// Invoke Parse Service and return results			

				//return new Dto.ObservationUploadResponse { Filenames = streamProvider.FileData.Select(fd => fd.LocalFileName) };

				// Send the Response back
				var pageBuilder = new StringBuilder();
				pageBuilder.Append("<html><head></head>");
				pageBuilder.Append(String.Format("<body><script type='text/javascript'>parent.postMessage('{0}:', '*');</script></body></html>", ObservationUploadString));
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

		[HttpGet]
		[Route("{observationKey:int?}/rows")]
		public IEnumerable<ObservationRow> GetFirstRows(int observationKey)
		{
			var ops = new ObservationParserService(WebConfiguration);
			var destinationFolder = WebConfiguration.AppSettings["ObservationFileSaveDirectory"];
			var directoryInfo = new DirectoryInfo(destinationFolder);
			var file = directoryInfo.GetFiles().OrderByDescending(x => x.CreationTimeUtc).First(x => x.Extension.Contains(".xls")).FullName;
			return ops.GetFirstRows(10, file);
		}
    }
}
