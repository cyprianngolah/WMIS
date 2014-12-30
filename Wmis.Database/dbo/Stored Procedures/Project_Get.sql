CREATE PROCEDURE [dbo].[Project_Get]
	@p_projectId INT
AS
	SELECT TOP 1
		p.[ProjectId] AS [Key], 
		p.[WildlifeResearchPermitId], 
		p.[Name], 
		p.[StatusDate], 
		p.[StartDate], 
		p.[EndDate], 
		p.[IsSensitiveData], 
		p.[Description], 
		p.[Objectives], 
		p.[StudyArea], 
		p.[Methods], 
		p.[Comments], 
		p.[Results], 
		p.[TermsAndConditions],
		p.[LastUpdated], 
		p.[LeadRegionId] AS [Key], 
		lr.Name as Name,
		p.[ProjectLeadId] AS [Key], 
		pr.Name, 
		pr.Email,
		p.[ProjectStatusId] AS [Key],
		ps.Name
	FROM
		dbo.Project p
			LEFT OUTER JOIN dbo.LeadRegion lr on p.LeadRegionId = lr.LeadRegionId
			LEFT OUTER JOIN dbo.Person pr on p.ProjectLeadId = pr.PersonId
			LEFT OUTER JOIN dbo.ProjectStatus ps on p.ProjectStatusId = ps.ProjectStatusId
	WHERE
		p.ProjectId =  @p_projectId
GO

GRANT EXECUTE ON [dbo].[Project_Get] TO [WMISUser]
GO