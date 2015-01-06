namespace Wmis.WebApi
{
	using System.Net;
	using System.Net.Http;
	using System.Text;
	using System.Web;
	using System.Web.Http.Filters;

	public class IFrameProgressExceptionHandler : ExceptionFilterAttribute
	{
		private readonly string messageSource;

		public IFrameProgressExceptionHandler(string messageSource)
		{
			this.messageSource = messageSource;
		}

		public override void OnException(HttpActionExecutedContext actionExecutedContext)
		{
			var hre = actionExecutedContext.Exception;
			var pageBuilder = new StringBuilder();
			pageBuilder.Append("<html><head></head>");
			//// pageBuilder.Append("<body><script type='text/javascript'>parent.postMessage('" + hre.Message + "', '*');</script></body></html>");
			pageBuilder.Append(string.Format("<body><script type='text/javascript'>parent.postMessage('{0}:{1}', '*');</script></body></html>", this.messageSource, HttpUtility.JavaScriptStringEncode(hre.Message)));
			
			actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.OK, pageBuilder.ToString(), new PlainTextFormatter());
		}
	}
}