CREATE PROCEDURE [dbo].[Collar_Update]
	@p_CollarId INT,
	@p_Name NVARCHAR (50),
	@p_SubscriptionId NVARCHAR (50) = NULL,
	@p_VhfFrequency NVARCHAR (50) = NULL,
	@p_CollarTypeId NVARCHAR (50) = NULL,
	@p_JobNumber NVARCHAR (50) = NULL,
	@p_Model NVARCHAR (50) = NULL,
	@p_CollarStatusId INT = NULL,
	@p_CollarMalfunctionId INT = NULL,
	@p_CollarRegionId INT = NULL,
	@p_CollarStateId INT = NULL,
	@p_InactiveDate DATETIME = NULL,
	@p_Size NVARCHAR (50) = NULL,
	@p_BeltingColour NVARCHAR (50) = NULL,
	@p_FirmwareVersion NVARCHAR (MAX) = NULL,
	@p_DropOffDate DATETIME = NULL,
	@p_EstimatedDropOff DATETIME = NULL,
	@p_EstimatedGpsFailure DATETIME = NULL,
	@p_EstimatedGpsBatteryEnd DATETIME = NULL,
	@p_EstimatedVhfFailure DATETIME = NULL,
	@p_EstimatedVhfBatteryEnd DATETIME = NULL,
	@p_ProjectId INT = NULL
AS

	IF EXISTS (SELECT 1 FROM dbo.Collars WHERE
		CollarId = @p_CollarId
		AND @p_ProjectId IS NOT NULL
		AND ProjectId != @p_ProjectId
	)
	BEGIN
		INSERT INTO CollarHistory (CollarId, ActionTaken) VALUES (@p_CollarId, "Assigned Project ID = " + CAST(@p_ProjectId AS VARCHAR(13)))
	END

	IF EXISTS (SELECT 1 FROM dbo.Collars WHERE
		CollarId = @p_CollarId
		AND @p_ProjectId IS NULL
		AND ProjectId IS NOT NULL
	)
	BEGIN
		INSERT INTO CollarHistory (CollarId, ActionTaken) VALUES (@p_CollarId, "Unassigned Project")
	END

	IF EXISTS (SELECT 1 FROM dbo.Collars WHERE
		CollarId = @p_CollarId
		AND CollarRegionId != @p_CollarRegionId
	)
	BEGIN
		INSERT INTO CollarHistory (CollarId, ActionTaken) VALUES (@p_CollarId, "Assigned Region = " + (SELECT Name from CollarRegions where CollarRegionId = @p_CollarRegionId))
	END


	UPDATE
		dbo.Collars
	SET
		Name = @p_Name,
		SubscriptionId = @p_SubscriptionId,
		VhfFrequency = @p_VhfFrequency,
		CollarTypeId = @p_CollarTypeId,
		JobNumber = @p_JobNumber,
		Model = @p_Model,
		CollarRegionId = @p_CollarRegionId,
		InactiveDate = @p_InactiveDate,
		Size = @p_Size,
		BeltingColour = @p_BeltingColour,
		FirmwareVersion = @p_FirmwareVersion,
		DropOffDate = @p_DropOffDate,
		EstimatedDropOff = @p_EstimatedDropOff,
		EstimatedGpsFailure = @p_EstimatedGpsFailure,
		EstimatedGpsBatteryEnd = @p_EstimatedGpsBatteryEnd,
		EstimatedVhfFailure = @p_EstimatedVhfFailure,
		EstimatedVhfBatteryEnd = @p_EstimatedVhfBatteryEnd,
		CollarStatusId = @p_CollarStatusId,
		CollarMalfunctionId = @p_CollarMalfunctionId,
		CollarStateId = @p_CollarStateId,
		ProjectId = @p_ProjectId,
		LastUpdated = GETUTCDATE()
	WHERE
		CollarId = @p_CollarId 

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Collar_Update] TO [WMISUser]
GO