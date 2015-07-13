CREATE PROCEDURE [dbo].[CollaredAnimalWarning_Update]
	@p_CollaredAnimalId INT,
	@p_CollarStateId INT = NULL,
	@p_ChangeBy NVARCHAR(50),
	@p_Item NVARCHAR(250),
	@p_Warning NVARCHAR(250)
AS

	INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Collar State", (SELECT Name from CollarStates where CollarStateId = @p_CollarStateId), @p_ChangeBy);
	INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, Comment, ChangeBy) VALUES (@p_CollaredAnimalId, @p_Item, "Yes", @p_Warning, @p_ChangeBy);

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