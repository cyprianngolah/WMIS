using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Wmis.Controllers
{
    using System.IO;
    using System.Xml.Serialization;

    using Wmis.ApiControllers;
    using Wmis.Configuration;
    using Wmis.Dto;
    using Wmis.Models;

    [RoutePrefix("api/argos")]
    public class ArgosApiController : BaseApiController
    {
        public ArgosApiController(WebConfiguration config) 
			: base(config)
		{
		}

        [HttpGet]
        [Route("passes")]
        public Dto.PagedResultset<ArgosPass> PassesForCollar([FromUri]ArgosPassSearchRequest apsr)
        {
            return Repository.ArgosPassGet(apsr);
        }
        
        [HttpPost]
        [Route("run/{collaredAnimalId:int?}")]
        public List<ArgosPassForTvp> RetrieveForCollar(int collaredAnimalId)
        {
            return this.retrievePathFromArgos(collaredAnimalId);
        }

        List<ArgosPassForTvp> retrievePathFromArgos(int collaredAnimalId)
        {
            var argosXmlString = retreiveArgosXmlStringForCollar(collaredAnimalId);
            var argosData = convertArgosXmlStringToArgosData(argosXmlString);
            var argosPasses = convertArgosDataToPasses(argosData);

            Repository.ArgosPassUpdate(collaredAnimalId, argosPasses);

            return argosPasses;
        }

        static ArgosData convertArgosXmlStringToArgosData(string xmlString)
        {
            var xmlStringReader = new StringReader(xmlString);
            var xRoot = new XmlRootAttribute { ElementName = "data", IsNullable = true };
            var serializer = new XmlSerializer(typeof(ArgosData), xRoot);
            return (ArgosData)serializer.Deserialize(xmlStringReader);
        }

        static List<ArgosPassForTvp> convertArgosDataToPasses(ArgosData argosData)
        {
            var passes = argosData.program[0].platform[0].satellitePass;
            var nonNull = passes.Where(pass => pass.location != null);
            var coordinates = nonNull.Select(pass => new ArgosPassForTvp { Latitude = pass.location.latitude, Longitude = pass.location.longitude, LocationDate = pass.location.locationDate});
            return coordinates.ToList();
        }

        static string retreiveXsd(int colarId)
        {
            var service = new ArgosService.DixServicePortTypeClient();
            var request = new ArgosService.xsdRequestType();
            var response = service.getXsd(request);
            return response.@return;
        }

        static string retreiveArgosXmlStringForCollar(int colarId)
        {
            var service = new ArgosService.DixServicePortTypeClient();

            var request = new ArgosService.xmlRequestType
                              {
                                  username = "gunn",
                                  password = "northter",
                                  Item1 = recordsForLastDays(9),
                                  ItemElementName = ArgosService.ItemChoiceType.platformId,
                                  Item = colarId.ToString()
                              };

            //            username = "sahtu";
            //            password = "gisewo";

            //            username = "nagyjohn";
            //            password = "bluenose";

            ArgosService.stringResponseType res = service.getXml(request);
            return res.@return;
        }

        static ArgosService.periodType recordsFromDate(int year, int month, int day)
        {
            return new ArgosService.periodType { startDate = new DateTime(year, month, day), endDateSpecified = false };
        }

        static int recordsForLastDays(int days)
        {
            return days;
        }
    }

}
