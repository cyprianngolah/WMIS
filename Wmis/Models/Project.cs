namespace Wmis.Models
{
    using Base;
    using System;

    public class Project : KeyedModel
    {
        public string Name { get; set; }

        public string ProjectNumber { get; set; }

        public string WildlifeResearchPermitNumber { get; set; }

        public LeadRegion LeadRegion { get; set; }

        public ProjectStatus Status { get; set; }

        public DateTime? StatusDate { get; set; }

        public Person ProjectLead { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsSensitiveData { get; set; }

        public string Description { get; set; }

        public string Objectives { get; set; }

        public string StudyArea { get; set; }

        public string Methods { get; set; }

        public string Comments { get; set; }

        public string Results { get; set; }

        public string TermsAndConditions { get; set; }

        public int CollarCount { get; set; }

        public DateTime LastUpdated { get; set; }

        public bool IsAdmin { get; set; }
    }
}