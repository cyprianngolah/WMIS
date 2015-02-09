namespace Wmis.Argos
{
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;
	using System.Xml.Serialization;

	using Wmis.Argos.Entities;

	public class ArgosDataClient
	{
		#region Fields
		private readonly string _username;

		private readonly string _password;
		#endregion

		#region Constructors
		public ArgosDataClient(string username, string password)
		{
			_username = username;
			_password = password;
		}
		#endregion

		public IEnumerable<ArgosSatellitePass> RetrieveArgosDataForCollar(string subscriptionId)
		{
			// Request
			var service = new ArgosService.DixServicePortTypeClient();
			var request = new ArgosService.xmlRequestType
			{
				username = _username,
				password = _password,
				Item1 = RecordsForLastDays(9),
				ItemElementName = ArgosService.ItemChoiceType.platformId,
				Item = subscriptionId
			};
			var response = service.getXml(request);

			// Parse Response from XML into a collection of ArgosSatellitePass data
			var xmlResponseString = response.@return;
			var xmlStringReader = new StringReader(xmlResponseString);
			var xRoot = new XmlRootAttribute { ElementName = "data", IsNullable = true };
			var serializer = new XmlSerializer(typeof(ArgosData), xRoot);
			var data = (ArgosData)serializer.Deserialize(xmlStringReader);
			if(data.program != null && data.program.Any() && data.program[0].platform.Any() && data.program[0].platform[0].satellitePass.Any(x=>x.location != null))
				return data.program[0].platform[0].satellitePass.Where(x => x.location != null).Select(
					pass =>
						new ArgosSatellitePass
							{
								Latitude = pass.location.latitude,
								Longitude = pass.location.longitude,
								Timestamp = pass.location.locationDate
							});

			return new List<ArgosSatellitePass>();
		}

		#region Helpers
		private ArgosService.periodType RecordsFromDate(int year, int month, int day)
		{
			return new ArgosService.periodType { startDate = new DateTime(year, month, day), endDateSpecified = false };
		}

		private int RecordsForLastDays(int days)
		{
			return days;
		}
		#endregion
	}
}
