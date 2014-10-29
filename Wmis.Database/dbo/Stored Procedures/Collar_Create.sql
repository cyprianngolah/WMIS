CREATE PROCEDURE [dbo].[Collar_Create]
	@p_name NVARCHAR(50)
AS
	INSERT INTO dbo.Collars (Name)
	VALUES (@p_name)

	SELECT SCOPE_IDENTITY()

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Collar_Create] TO [WMISUser]
GO