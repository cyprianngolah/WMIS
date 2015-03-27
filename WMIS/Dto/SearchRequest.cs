using System;
using System.Collections.Generic;
using Wmis.Models;

namespace Wmis.Dto
{
    public class SearchRequest : PagedDataRequest
    {
        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public List<int> SpeciesIds { get; set; }

        public List<int> NWTSaraStatusIds { get; set; }

        public List<int> FederalSaraStatusIds { get; set; }

        public List<int> GeneralRankStatusIds { get; set; }

        public List<int> NwtSarcAssessmentIds { get; set; }

        public List<int> SurveyTypeIds { get; set; }

        public double? TopLatitude { get; set; }

        public double? TopLongitude { get; set; }

        public double? BottomLatitude { get; set; }

        public double? BottomLongitude { get; set; }

        public SearchRequest()
        {
            SpeciesIds = new List<int>();
            NWTSaraStatusIds = new List<int>();
            FederalSaraStatusIds = new List<int>();
            GeneralRankStatusIds = new List<int>();
            NwtSarcAssessmentIds = new List<int>();
            SurveyTypeIds = new List<int>();
        }
    }
}