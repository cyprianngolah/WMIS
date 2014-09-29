CREATE PROCEDURE [dbo].[Project_Create]
	@p_name NVARCHAR(50)
AS
	INSERT INTO dbo.Project (Name, LastUpdated)
	VALUES (@p_name, GETUTCDATE())

	SELECT SCOPE_IDENTITY()

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Project_Create] TO [WMISUser]
GO