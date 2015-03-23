namespace Wmis.Argos
{
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;
	using System.Text;
	using System.Xml.Serialization;

	using Wmis.Argos.Entities;

	public class ArgosDataClient
	{
	    private const int DAYS_TO_DOWNLOAD = 9;

		#region Constructors
		public ArgosDataClient()
		{
		}
		#endregion

        /// <summary>
        /// Downloads Argos data for a single collar
        /// </summary>
        /// <param name="subscriptionId">The collar to query</param>
        /// <param name="username">The login user associated with the program</param>
        /// <param name="password">The login password associated with the program</param>
        /// <returns>SatellitePass data</returns>
        public IEnumerable<ArgosSatellitePass> RetrieveArgosDataForCollar(string subscriptionId, string username, string password)
		{
			// Request
			var service = new ArgosService.DixServicePortTypeClient();
			var request = new ArgosService.xmlRequestType
			{
				username = username,
				password = password,
                Item1 = RecordsForLastDays(DAYS_TO_DOWNLOAD),
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

        /// <summary>
        /// Downloads Argos data for all collars in a program
        /// </summary>
        /// <param name="programNumber">The program to query</param>
        /// <param name="username">The login user associated with the program</param>
        /// <param name="password">The login password associated with the program</param>
        /// <returns>SatellitePass data</returns>
        public IEnumerable<ArgosSatellitePass> RetrieveArgosDataForProgram(string programNumber, string username, string password)
        {
            // Request
            var service = new ArgosService.DixServicePortTypeClient();
            var request = new ArgosService.xmlRequestType
            {
                username = username,
                password = password,
                Item1 = RecordsForLastDays(DAYS_TO_DOWNLOAD),
                ItemElementName = ArgosService.ItemChoiceType.programNumber,
                Item = programNumber
            };
            var response = service.getStreamXml(request);

            // Parse Response from XML into a collection of ArgosSatellitePass data
            var xmlResponseString = Encoding.UTF8.GetString(response.@return);
            var xmlStringReader = new StringReader(xmlResponseString);
            var xRoot = new XmlRootAttribute { ElementName = "data", IsNullable = true };
            var serializer = new XmlSerializer(typeof(ArgosData), xRoot);
            var data = (ArgosData)serializer.Deserialize(xmlStringReader);

            if (data.program != null && data.program.Any() && data.program[0].platform.Any())
            {
                var platforms = data.program[0].platform.ToList();
                var passesByPlatform = platforms.Select(p => new { PlatformId = p.platformId, SatellitePasses = p.satellitePass.Where(sp => sp.location != null).Select(sp => sp.location) });

                return passesByPlatform.SelectMany(pass => pass.SatellitePasses.Select(spp => new ArgosSatellitePass { PlatformId = pass.PlatformId, Latitude = spp.latitude, Longitude = spp.longitude, Timestamp = spp.locationDate }));
            }

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
