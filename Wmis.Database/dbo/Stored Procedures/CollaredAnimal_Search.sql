
CREATE PROCEDURE [dbo].[CollaredAnimal_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_subSortBy NVARCHAR(25) = NULL,
	@p_subSortDirection NVARCHAR(3) = NULL,
	@p_keywords NVARCHAR(50) = NULL,
	@p_regionKey int = NULL,
	@p_needingReview BIT = 0,
	@p_activeOnly BIT = 0
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		c.CollaredAnimalId as [Key],
		c.CollarId,
		c.AnimalId,
		c.SubscriptionId,
		c.VhfFrequency,
		c.JobNumber,
		c.Model,
		c.InactiveDate,
		c.Size,
		c.BeltingColour,
		c.FirmwareVersion,
		c.Comments,
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
		collarState.Name as [CollarStateName],
		c.HerdPopulationId as [HerdPopulationKey],
		herdPopulation.Name as [HerdPopulationName]
	FROM
		dbo.CollaredAnimals c
		LEFT OUTER JOIN dbo.CollarStatuses collarStatus on c.CollarStatusId = collarStatus.CollarStatusId
		LEFT OUTER JOIN dbo.CollarMalfunctions collarMalfunction on c.CollarMalfunctionId = collarMalfunction.CollarMalfunctionId
		LEFT OUTER JOIN dbo.CollarStates collarState on c.CollarStateId = collarState.CollarStateId
		LEFT OUTER JOIN dbo.CollarTypes collarType on c.CollarTypeId = collarType.CollarTypeId
		LEFT OUTER JOIN dbo.CollarRegions collarRegion on c.CollarRegionId = collarRegion.CollarRegionId
		LEFT OUTER JOIN dbo.Project project on c.ProjectId = project.ProjectId
		LEFT OUTER JOIN dbo.HerdPopulations herdPopulation on c.HerdPopulationId = herdPopulation.HerdPopulationId
		LEFT OUTER JOIN dbo.AnimalSexes sex ON c.AnimalSexId = sex.AnimalSexId
		LEFT OUTER JOIN dbo.AnimalMortalities mort ON c.AnimalMortalityId = mort.AnimalMortalityId
		LEFT OUTER JOIN dbo.ArgosPrograms program ON c.ArgosProgramId = program.ArgosProgramId
	WHERE
		(@p_regionKey IS NULL OR c.CollarRegionId = @p_regionKey) 
		AND
		(
			@p_keywords IS NULL 
			OR c.CollarId LIKE '%' + @p_keywords + '%' 
			OR collarRegion.Name LIKE '%' + @p_keywords + '%'  
			OR collarType.Name LIKE '%' + @p_keywords + '%'  
			OR collarState.Name LIKE '%' + @p_keywords + '%'
			OR collarStatus.Name LIKE '%' + @p_keywords + '%'
			OR project.Name LIKE '%' + @p_keywords + '%'
			OR c.AnimalId LIKE '%' + @p_keywords + '%'
			OR c.SubscriptionId LIKE '%' + @p_keywords + '%'
			OR c.Model LIKE '%' + @p_keywords + '%'
			OR herdPopulation.Name LIKE '%' + @p_keywords + '%'
			OR collarMalfunction.Name LIKE '%' + @p_keywords + '%'
			OR c.VhfFrequency LIKE '%' + @p_keywords + '%'
			OR c.JobNumber LIKE '%' + @p_keywords + '%'
			OR sex.Name LIKE '%' + @p_keywords + '%'
			OR mort.Name LIKE '%' + @p_keywords + '%'
			OR program.ProgramNumber LIKE '%' + @p_keywords + '%'
		)
		AND 
		(
			@p_needingReview = 0
			OR 
			(
				c.CollarStateId = 4 -- On - With Warnings
				And c.CollarStatusId IN (1,2, 3, 14) --(Deployed, Suspected Stationary, Stationary, Malfunctioning)
				AND (NOT AnimalStatusId = 2 OR AnimalStatusId IS NULL) -- Status <> Dead
			)
		)
		AND 
		(
			@p_activeOnly = 0
			OR
			(
				c.CollarStateId IN (1,4) --Active
			)
		)
	ORDER BY
	CASE WHEN @p_sortDirection = '0' THEN
        CASE 
           WHEN @p_sortBy = 'collarType.name' THEN [collarType].Name
           WHEN @p_sortBy = 'collarState.name' THEN CAST(COALESCE([collarState].[Order], '15') AS NVARCHAR)
           WHEN @p_sortBy = 'collarId' THEN [collarId] 
           WHEN @p_sortBy = 'collarStatus.name' THEN [collarStatus].[Order] 
           WHEN @p_sortBy = 'vhfFrequency' THEN [VhfFrequency] 
           WHEN @p_sortBy = 'animalId' THEN [AnimalId] 
           WHEN @p_sortBy = 'herdPopulation.name' THEN [herdPopulation].Name
           WHEN @p_sortBy = 'project.key' THEN CAST([project].ProjectId AS NVARCHAR)
           WHEN @p_sortBy = 'project.name' THEN [project].Name 
           WHEN @p_sortBy = 'inactiveDate' THEN CAST([InactiveDate] AS NVARCHAR)
        END
    END ASC
    , CASE WHEN @p_sortDirection = '1' THEN
        CASE 
           WHEN @p_sortBy = 'collarType.name' THEN [collarType].Name
           WHEN @p_sortBy = 'collarState.name' THEN CAST(COALESCE([collarState].[Order], '15') AS NVARCHAR)
           WHEN @p_sortBy = 'collarId' THEN [collarId] 
           WHEN @p_sortBy = 'collarStatus.name' THEN [collarStatus].[Order] 
           WHEN @p_sortBy = 'vhfFrequency' THEN [VhfFrequency] 
           WHEN @p_sortBy = 'animalId' THEN [AnimalId] 
           WHEN @p_sortBy = 'herdPopulation.name' THEN [herdPopulation].Name
           WHEN @p_sortBy = 'project.key' THEN CAST([project].ProjectId AS NVARCHAR)
           WHEN @p_sortBy = 'project.name' THEN [project].Name 
           WHEN @p_sortBy = 'inactiveDate' THEN CAST([InactiveDate] AS NVARCHAR)
        END
    END DESC
	,
    CASE WHEN @p_subSortDirection = '0' THEN
        CASE 
           WHEN @p_subSortBy = 'collarType.name' THEN [collarType].Name
           WHEN @p_subSortBy = 'collarState.name' THEN CAST(COALESCE([collarState].[Order], '15') AS NVARCHAR)
           WHEN @p_subSortBy = 'collarId' THEN [collarId] 
           WHEN @p_subSortBy = 'collarStatus.name' THEN [collarStatus].[Order] 
           WHEN @p_subSortBy = 'vhfFrequency' THEN [VhfFrequency] 
           WHEN @p_subSortBy = 'animalId' THEN [AnimalId] 
           WHEN @p_subSortBy = 'herdPopulation.name' THEN [herdPopulation].Name
           WHEN @p_subSortBy = 'project.key' THEN CAST([project].ProjectId AS NVARCHAR)
           WHEN @p_subSortBy = 'project.name' THEN [project].Name 
           WHEN @p_subSortBy = 'inactiveDate' THEN CAST([InactiveDate] AS NVARCHAR)
        END
    END ASC
    , CASE WHEN @p_subSortDirection = '1' THEN
        CASE 
           WHEN @p_subSortBy = 'collarType.name' THEN [collarType].Name
           WHEN @p_subSortBy = 'collarState.name' THEN CAST(COALESCE([collarState].[Order], '15') AS NVARCHAR)
           WHEN @p_subSortBy = 'collarId' THEN [collarId] 
           WHEN @p_subSortBy = 'collarStatus.name' THEN [collarStatus].[Order] 
           WHEN @p_subSortBy = 'vhfFrequency' THEN [VhfFrequency] 
           WHEN @p_subSortBy = 'animalId' THEN [AnimalId] 
           WHEN @p_subSortBy = 'herdPopulation.name' THEN [herdPopulation].Name
           WHEN @p_subSortBy = 'project.key' THEN CAST([project].ProjectId AS NVARCHAR)
           WHEN @p_subSortBy = 'project.name' THEN [project].Name 
           WHEN @p_subSortBy = 'inactiveDate' THEN CAST([InactiveDate] AS NVARCHAR)
        END
    END DESC

	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollaredAnimal_Search] TO [WMISUser]
GO