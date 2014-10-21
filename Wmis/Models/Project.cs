﻿namespace Wmis.Models
{
	using System;
	using Base;

	public class Project : KeyedModel
	{
		public string Name { get; set; }

		public int? WildlifeResearchPermitId { get; set; }

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

		public DateTime LastUpdated { get; set; }
	}
}