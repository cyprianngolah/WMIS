CREATE PROCEDURE [dbo].[CollaredAnimalWarning_Update]
	@p_CollaredAnimalId INT,
	@p_CollarStateId INT = NULL,
	@p_ChangeBy NVARCHAR(50),
	@p_Item NVARCHAR(250),
	@p_Warning NVARCHAR(250),
	@p_Value NVARCHAR(250)
AS

	--Collar State
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND CollarStateId != @p_CollarStateId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Collar State", (SELECT Name from CollarStates where CollarStateId = @p_CollarStateId), @p_ChangeBy);
	END

	--Collar State
	IF EXISTS (SELECT 1 FROM dbo.HistoryLogs WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND Item = "Collar State"
		AND Comment != @p_Warning
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, Comment, ChangeBy) VALUES (@p_CollaredAnimalId, @p_Item, @p_Value, @p_Warning, @p_ChangeBy);
	END
	
	UPDATE
		dbo.CollaredAnimals
	SET
		CollarStateId = @p_CollarStateId
	WHERE
		CollaredAnimalId = @p_CollaredAnimalId 

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollaredAnimalWarning_Update] TO [WMISUser]
GO