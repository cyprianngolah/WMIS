CREATE PROCEDURE [dbo].[BioDiversity_Create]
	@p_name NVARCHAR(50)
AS
	INSERT INTO dbo.Species (Name, LastUpdated)
	VALUES (@p_name, GETUTCDATE())

	SELECT SCOPE_IDENTITY()

RETURN 0
GO

GRANT EXECUTE ON [dbo].[BioDiversity_Create] TO [WMISUser]
GO