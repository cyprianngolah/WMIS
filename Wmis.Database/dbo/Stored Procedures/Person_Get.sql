CREATE PROCEDURE [dbo].[Person_Get]
	@p_personId INT
AS
	SELECT TOP 1
		p.PersonId as [Key],
		p.Name,
		p.Username,
		p.Email,
		p.JobTitle

	FROM
		dbo.Person p
	where
		p.PersonId = @p_personId

	SELECT
		up.ProjectId as [Key],
		proj.Name
	FROM
		dbo.PersonProjects up
			INNER JOIN dbo.Project proj on up.ProjectId = proj.ProjectId
	WHERE
		up.PersonId = @p_personId

	SELECT
		r.RoleId as [Key],
		r.Name
	FROM
		dbo.PersonRole pr
			INNER JOIN dbo.[Role] r on pr.RoleId = r.RoleId
	WHERE	
		pr.PersonId = @p_personId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Person_Get] TO [WMISUser]
GO