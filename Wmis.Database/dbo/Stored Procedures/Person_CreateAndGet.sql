CREATE PROCEDURE [dbo].[Person_CreateAndGet]
	@p_username NVARCHAR(50)
AS
	DECLARE @v_personKey INT = NULL;

	SELECT TOP 1
		@v_personKey = PersonId
	FROM
		dbo.Person	
	WHERE
		Username = @p_username
	
	IF(@v_personKey IS NULL)
	BEGIN
		EXEC [dbo].[Person_Create]
			@p_Username	= @p_username,
			@p_Name = '',
			@p_PersonKey = @v_personKey OUTPUT
	END

	EXEC [dbo].[Person_Get] @v_personKey

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Person_CreateAndGet] TO [WMISUser]
GO