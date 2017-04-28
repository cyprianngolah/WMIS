CREATE PROCEDURE [dbo].[Project_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_projectLeadId INT = NULL,
	@p_projectStatusId INT = NULL,
	@p_leadRegionId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	
	SELECT 
		COUNT(*) OVER() AS ResultCount,
		p.[ProjectId] AS [Key],
		p.[ProjectNumber], 
		p.[WildlifeResearchPermitNumber],
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
		pr.JobTitle, 
		pr.Email,
		p.[ProjectStatusId] AS [Key],
		ps.Name
	FROM
		dbo.Project p
			LEFT OUTER JOIN dbo.LeadRegion lr on p.LeadRegionId = lr.LeadRegionId
			LEFT OUTER JOIN dbo.Person pr on p.ProjectLeadId = pr.PersonId
			LEFT OUTER JOIN dbo.ProjectStatus ps on p.ProjectStatusId = ps.ProjectStatusId
	WHERE
		(@p_projectLeadId IS NULL OR p.[ProjectLeadId] = @p_projectLeadId)
		AND (@p_projectStatusId IS NULL OR p.[ProjectStatusId] = @p_projectStatusId)
		AND (@p_leadRegionId IS NULL OR p.[LeadRegionId] = @p_leadRegionId)
		AND (
			@p_keywords IS NULL
			OR p.[ProjectId] LIKE '%' + @p_keywords + '%'
			OR p.[ProjectNumber] LIKE '%' + @p_keywords + '%' 
			OR p.[Name] LIKE '%' + @p_keywords + '%' 
		)
	ORDER BY
		CASE WHEN @p_sortBy = 'key' AND @p_sortDirection = '0'
			THEN p.[ProjectId] END ASC,
		CASE WHEN @p_sortBy = 'key' AND @p_sortDirection = '1'
			THEN p.[ProjectId] END DESC,
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '0'
			THEN p.[Name] END ASC,
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '1'
			THEN p.[Name] END DESC,
		CASE WHEN @p_sortBy = 'leadRegion.name' AND @p_sortDirection = '0'
			THEN lr.Name END ASC,
		CASE WHEN @p_sortBy = 'leadRegion.name' AND @p_sortDirection = '1'
			THEN lr.Name END DESC,
		CASE WHEN @p_sortBy = 'projectLead.jobTitle' AND @p_sortDirection = '0'
			THEN pr.JobTitle END ASC,
		CASE WHEN @p_sortBy = 'projectLead.jobTitle' AND @p_sortDirection = '1'
			THEN pr.JobTitle END DESC,
		CASE WHEN @p_sortBy = 'status.name' AND @p_sortDirection = '0'
			THEN ps.Name END ASC,
		CASE WHEN @p_sortBy = 'status.name' AND @p_sortDirection = '1'
			THEN ps.Name END DESC,
		CASE WHEN @p_sortBy = 'statusDate' AND @p_sortDirection = '0'
			THEN p.[StatusDate] END ASC,
		CASE WHEN @p_sortBy = 'statusDate' AND @p_sortDirection = '1'
			THEN p.[StatusDate] END DESC,
		CASE WHEN @p_sortBy = 'startDate' AND @p_sortDirection = '0'
			THEN p.[StartDate] END ASC,
		CASE WHEN @p_sortBy = 'startDate' AND @p_sortDirection = '1'
			THEN p.[StartDate] END DESC
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY
GO

GRANT EXECUTE ON [dbo].[Project_Search] TO [WMISUser]
GO
