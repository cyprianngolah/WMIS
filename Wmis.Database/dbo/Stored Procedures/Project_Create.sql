CREATE PROCEDURE [dbo].[Project_Create]
	@p_name NVARCHAR(50),
	@p_createdBy NVARCHAR (50)
AS
	

	INSERT INTO dbo.Project (Name, LastUpdated)
	VALUES (@p_name, GETUTCDATE())

	SELECT SCOPE_IDENTITY()

	--History Log - Project Created
	INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES ((SELECT SCOPE_IDENTITY()), "Project Created", GETUTCDATE(), @p_createdBy)

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Project_Create] TO [WMISUser]
GO