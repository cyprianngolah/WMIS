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
		public ArgosDataClient()
		{
			_username = "gunn";
			_password = "northter";
		}

		public ArgosDataClient(string username, string password)
		{
			_username = username;
			_password = password;
		}
		#endregion

		private IEnumerable<ArgosSatellitePass> RetrieveArgosDataForCollar(int subscriptionId)
		{
			var service = new ArgosService.DixServicePortTypeClient();
			var request = new ArgosService.xmlRequestType
			{
				username = _username,
				password = _password,
				Item1 = RecordsForLastDays(9),
				ItemElementName = ArgosService.ItemChoiceType.platformId,
				Item = subscriptionId.ToString()
			};

			var response = service.getXml(request);
			var xmlResponseString = response.@return;
			var xmlStringReader = new StringReader(xmlResponseString);
			var xRoot = new XmlRootAttribute { ElementName = "data", IsNullable = true };
			var serializer = new XmlSerializer(typeof(ArgosData), xRoot);
			var data = (ArgosData)serializer.Deserialize(xmlStringReader);
			return data.program[0].platform[0].satellitePass.Where(x => x.location != null).Select(
				pass =>
					new ArgosSatellitePass
						{
							Latitude = pass.location.latitude,
							Longitude = pass.location.longitude,
							Timestamp = pass.location.locationDate
						});
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
