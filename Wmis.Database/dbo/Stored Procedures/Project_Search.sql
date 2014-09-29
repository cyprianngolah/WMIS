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
	/*
	EXEC [dbo].[BioDiversity_Search]
	*/

	SELECT 
		COUNT(*) OVER() AS ResultCount,
		p.[ProjectId] AS [Key], 
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
			INNER JOIN dbo.LeadRegion lr on p.LeadRegionId = lr.LeadRegionId
			INNER JOIN dbo.Person pr on p.ProjectLeadId = pr.PersonId
			INNER JOIN dbo.ProjectStatus ps on p.ProjectStatusId = ps.ProjectStatusId
	WHERE
		(@p_projectLeadId IS NULL OR p.[ProjectLeadId] = @p_projectLeadId)
		AND (@p_projectStatusId IS NULL OR p.[ProjectStatusId] = @p_projectStatusId)
		AND (@p_leadRegionId IS NULL OR p.[LeadRegionId] = @p_leadRegionId)
		AND (
			@p_keywords IS NULL 
			OR p.[Name] LIKE '%' + @p_keywords + '%' 
		)
	ORDER BY
		p.ProjectId
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY
GO

GRANT EXECUTE ON [dbo].[Project_Search] TO [WMISUser]
GO
