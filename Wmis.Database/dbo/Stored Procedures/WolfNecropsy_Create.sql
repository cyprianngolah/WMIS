CREATE PROCEDURE [dbo].[WolfNecropsy_Create]
@p_necropsyId NVARCHAR(50),
	@p_createdBy NVARCHAR (50)
AS
	

	INSERT INTO dbo.WolfNecropsy (NecropsyId, LastUpdated)
	VALUES (@p_necropsyId, GETUTCDATE())

	SELECT SCOPE_IDENTITY()

	--History Log - WolfNecropsy Created
	INSERT INTO HistoryLogs (HistoryLogId, Item, Value, ChangeBy) VALUES ((SELECT SCOPE_IDENTITY()), " WolfNecropsy Created", GETUTCDATE(), @p_createdBy)

RETURN 0

