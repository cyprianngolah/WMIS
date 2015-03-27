using System;
using System.Collections.Generic;
using Wmis.Models;
using Wmis.Models.Base;

namespace Wmis.Dto
{
    public class SearchResponse : KeyedModel
    {
        public string Species { get; set; }

        public DateTime Date { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public string SurveyType { get; set; }

        public string AnimalId { get; set; }

        public string Herd { get; set; }

        public string Sex { get; set; }

        public int ArgosPassStatus { get; set; }
    }
}