namespace Wmis.Dto
{
    using System;
    using System.Collections.Generic;
    using Models;

    public class ToolsBatchRejectRequest
    {
        public string AnimalId { get; set; }
        
        public int RejectReasonId { get; set; }

        public string LastValidLocationDate { get; set; }

    }

    public class ToolsResetHerdPopulationRequest
    {
        public string AnimalId { get; set; }
    }

    public class VectronicsDataRequest
    {
        public string AnimalId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public DateTime LocationDate { get; set; }

        public string LocationClass { get; set; }
    }
}