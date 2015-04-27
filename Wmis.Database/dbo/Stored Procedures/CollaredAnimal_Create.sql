CREATE PROCEDURE [dbo].[CollaredAnimal_Create]
	@p_collarId NVARCHAR(50),
	@p_createdBy NVARCHAR (50)
AS
	INSERT INTO dbo.CollaredAnimals (CollarId)
	VALUES (@p_collarId)

	SELECT SCOPE_IDENTITY()
	
	--History Log - Collar Created
	INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES ((SELECT SCOPE_IDENTITY()), "Collar Created", GETUTCDATE(), @p_createdBy)

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollaredAnimal_Create] TO [WMISUser]
GO