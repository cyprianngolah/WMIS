CREATE PROCEDURE [dbo].[Person_Create]
	@p_Username	NVARCHAR(50),
	@p_Name NVARCHAR(50),
	@p_PersonKey INT = -1 OUTPUT
AS
	INSERT INTO dbo.Person (Username, Name)
	VALUES (@p_Username, @p_Name)

	IF(@p_PersonKey = -1)
	BEGIN
		SELECT SCOPE_IDENTITY()
	END
	ELSE
	BEGIN
		SET @p_PersonKey = SCOPE_IDENTITY()
	END


RETURN 0
GO

GRANT EXECUTE ON [dbo].[Person_Create] TO [WMISUser]
GO