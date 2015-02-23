CREATE PROCEDURE [dbo].[Users_Get]
	@p_userKey INT
AS
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
		UserId = @p_userKey

	SELECT
		up.ProjectId as [Key],
		p.Name
	FROM
		dbo.UserProjects up
			INNER JOIN dbo.Project p on up.ProjectId = p.ProjectId
	WHERE
		up.UserId = @p_userKey

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Users_Get] TO [WMISUser]
GO