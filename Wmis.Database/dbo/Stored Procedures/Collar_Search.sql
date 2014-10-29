
CREATE PROCEDURE [dbo].[Collar_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_keywords NVARCHAR(50) = NULL,
	@p_regionKey int = NULL
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		c.CollarId as [Key],
		c.Name,
		c.SubscriptionId,
		c.VhfFrequency,
		c.JobNumber,
		c.Model,
		c.InactiveDate,
		c.Size,
		c.BeltingColour,
		c.FirmwareVersion,
		c.DropOffDate,
		c.EstimatedDropOff,
		c.EstimatedGpsFailure,
		c.EstimatedGpsBatteryEnd,
		c.EstimatedVhfFailure,
		c.EstimatedVhfBatteryEnd,
		c.LastUpdated,
		c.ProjectId as [Key],
		project.Name,
		c.CollarTypeId as [Key],
		collarType.Name,
		c.CollarRegionId as [Key],
		collarRegion.Name,
		c.CollarStatusId as [Key],
		collarStatus.Name,
		1 as [Key],		-- Done to ensure the dynamic always maps back to an actual object and not null
		c.CollarMalfunctionId as [CollarMalfunctionKey],
		collarMalfunction.Name as [CollarMalfunctionName],
		c.CollarStateId as [CollarStateKey],
		collarState.Name as [CollarStateName]
	FROM
		dbo.Collars c
		LEFT OUTER JOIN dbo.CollarStatuses collarStatus on c.CollarStatusId = collarStatus.CollarStatusId
		LEFT OUTER JOIN dbo.CollarMalfunctions collarMalfunction on c.CollarMalfunctionId = collarMalfunction.CollarMalfunctionId
		LEFT OUTER JOIN dbo.CollarStates collarState on c.CollarStateId = collarState.CollarStateId
		LEFT OUTER JOIN dbo.CollarTypes collarType on c.CollarTypeId = collarType.CollarTypeId
		LEFT OUTER JOIN dbo.CollarRegions collarRegion on c.CollarRegionId = collarRegion.CollarRegionId
		LEFT OUTER JOIN dbo.Project project on c.ProjectId = project.ProjectId
	WHERE
		(@p_regionKey IS NULL OR c.CollarRegionId = @p_regionKey) 
		AND
		(
			@p_keywords IS NULL 
			OR c.Name LIKE '%' + @p_keywords + '%' 
			OR collarRegion.Name LIKE '%' + @p_keywords + '%'  
			OR collarType.Name LIKE '%' + @p_keywords + '%'  
			OR collarState.Name LIKE '%' + @p_keywords + '%'
			OR collarStatus.Name LIKE '%' + @p_keywords + '%'
			OR project.Name LIKE '%' + @p_keywords + '%'
		)
	ORDER BY
		CASE WHEN @p_sortBy = 'collarType.name' AND @p_sortDirection = '0'
			THEN [collarType].Name END ASC,
		CASE WHEN @p_sortBy = 'collarType.name' AND @p_sortDirection = '1'
			THEN [collarType].Name END DESC,
		CASE WHEN @p_sortBy = 'collarState.name' AND @p_sortDirection = '0'
			THEN [collarState].Name END ASC,
		CASE WHEN @p_sortBy = 'collarState.name' AND @p_sortDirection = '1'
			THEN [collarState].Name END DESC,
		CASE WHEN @p_sortBy = 'collarStatus.name' AND @p_sortDirection = '0'
			THEN [collarStatus].Name END ASC,
		CASE WHEN @p_sortBy = 'collarStatus.name' AND @p_sortDirection = '1'
			THEN [collarStatus].Name END DESC
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Collar_Search] TO [WMISUser]
GO