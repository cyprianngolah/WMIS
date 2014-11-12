CREATE PROCEDURE [dbo].[Collar_Get]
	@p_collarKey INT
AS
	SELECT TOP 1
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
		c.CollarId = @p_collarKey

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Collar_Get] TO [WMISUser]
GO