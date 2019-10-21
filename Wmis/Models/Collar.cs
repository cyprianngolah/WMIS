namespace Wmis.Models
{
    using System;
    using Base;
    using Newtonsoft.Json;

    public class Collar : KeyedModel
	{
        public string CollarId { get; set; }
	    
        public string SubscriptionId { get; set; }
	    
        public string VhfFrequency { get; set; }

        public CollarType CollarType { get; set; }
	    
        public string JobNumber { get; set; }

        public string DeploymentHerd { get; set; }

        public ArgosProgram ArgosProgram { get;set; }

        public bool HasPttBeenReturned { get; set; }
	    
        public string Model { get; set; }

        public string Geofencing { get; set; }

        public bool ReleasedOnSchedule { get; set; }

        public string ProgrammingSpec { get; set; }

        public CollarStatus CollarStatus { get; set; }

        public CollarMalfunction CollarMalfunction { get; set; }
	    
        public CollarRegion CollarRegion { get; set; }

        public CollarState CollarState { get; set; }

        public DateTime? InactiveDate { get; set; }

        public DateTime? DeploymentDate { get; set; }
	    
        public string Size { get; set; }
	    
        public string BeltingColour { get; set; }
	    
        public string FirmwareVersion { get; set; }

        public string Comments { get; set; }

        public DateTime? DropOffDate { get; set; }

        public DateTime? EstimatedDropOff { get; set; }

        public DateTime? EstimatedGpsFailure { get; set; }

        public DateTime? EstimatedGpsBatteryEnd { get; set; }

        public DateTime? EstimatedVhfFailure { get; set; }

        public DateTime? EstimatedVhfBatteryEnd { get; set; }

        public int? EstimatedYearOfBirth { get; set; }
        
        public string EstimatedYearOfBirthBy { get; set; }

        public string EstimatedYearOfBirthMethod { get; set; }

        public DateTime LastUpdated { get; set; }

        public SimpleProject Project { get; set; }

        public bool? SignsOfPredation { get; set; }

        public bool? EvidenceOfChase { get; set; }

        public bool? SignsOfScavengers { get; set; }

        public bool? SnowSinceDeath { get; set; }

        public bool? SignsOfHumans { get; set; }

        public AnimalStatus AnimalStatus { get; set; }

        public AgeClass AgeClass { get; set; }

        public AnimalSex AnimalSex { get; set; }

        public string AnimalId { get; set; }

        public AnimalMortality AnimalMortality { get; set; }

        public DateTime? MortalityDate { get; set; }

        public ConfidenceLevel MortalityConfidence { get; set; }

        public double? MortalityLatitude { get; set; }

        public double? MortalityLongitude { get; set; }

        public string BodyCondition { get; set; }

        public string CarcassPosition { get; set; }

        public string CarcassComments { get; set; }

        public HerdPopulation HerdPopulation { get; set; }

		public ConfidenceLevel HerdAssociationConfidenceLevel { get; set; }

		public HerdAssociationMethod HerdAssociationMethod { get; set; }

		public BreedingStatus BreedingStatus { get; set; }

		public ConfidenceLevel BreedingStatusConfidenceLevel { get; set; }

        public BreedingStatusMethod BreedingStatusMethod { get; set; }

        public DateTime? HerdAssociationDate { get; set; }

        public DateTime? BreedingStatusDate { get; set; }

        public int? SpeciesId { get; set; }
	}
}