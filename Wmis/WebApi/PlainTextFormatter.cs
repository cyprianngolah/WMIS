namespace Wmis.WebApi
{
	using System;
	using System.IO;
	using System.Net;
	using System.Net.Http.Formatting;
	using System.Net.Http.Headers;
	using System.Threading.Tasks;

	public class PlainTextFormatter : MediaTypeFormatter
	{
		public PlainTextFormatter()
		{
			SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
		}

		public override bool CanWriteType(Type type)
		{
			return type == typeof(string);
		}

		public override bool CanReadType(Type type)
		{
			return type == typeof(string);
		}

		public override Task WriteToStreamAsync(Type type, object value, Stream writeStream, System.Net.Http.HttpContent content, TransportContext transportContext)
		{
			return Task.Factory.StartNew(() =>
			{
				var writer = new StreamWriter(writeStream);
				writer.Write(value);
				writer.Flush();
			});
		}

		public override Task<object> ReadFromStreamAsync(Type type, Stream readStream, System.Net.Http.HttpContent content, IFormatterLogger formatterLogger)
		{
			return Task.Factory.StartNew(() =>
			{
				var reader = new StreamReader(readStream);
				return (object)reader.ReadToEnd();
			});
		}
	}
}