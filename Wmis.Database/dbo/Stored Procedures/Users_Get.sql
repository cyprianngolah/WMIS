CREATE PROCEDURE [dbo].[User_CreateAndGet]
	@p_username NVARCHAR(50)
AS
	DECLARE @v_userKey INT = NULL;

	SELECT TOP 1
		@v_userKey = UserId
	FROM
		dbo.Users	
	WHERE
		Username = @p_username
	
	IF(@v_userKey IS NULL)
	BEGIN
		EXEC [dbo].[Users_Create]
			@p_Username	= @p_username,
			@p_FirstName = '',
			@p_LastName = '',
			@p_AdministratorProjects = 0,
			@p_AdministratorBiodiversity = 0,
			@p_UserKey = @v_userKey OUTPUT
	END

	SELECT TOP 1
		UserId as [Key],
		Username,
		FirstName,
		LastName,
		AdministratorProjects,
		AdministratorBiodiversity
	FROM
		dbo.Users	
	WHERE
		UserId = @v_userKey

	SELECT
		up.ProjectId as [Key],
		p.Name
	FROM
		dbo.UserProjects up
			INNER JOIN dbo.Project p on up.ProjectId = p.ProjectId
	WHERE
		up.UserId = @v_userKey

RETURN 0
GO

GRANT EXECUTE ON [dbo].[User_CreateAndGet] TO [WMISUser]
GO