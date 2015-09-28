CREATE PROCEDURE [dbo].[Person_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_personId INT = NULL,
	@p_roleName NVARCHAR(50) = NULL,
	@p_projectLeadExists BIT = 0,
	@p_keywords NVARCHAR(50) = NULL
AS
	DECLARE @v_people TABLE(PersonId INT, Name NVARCHAR(50), Email NVARCHAR(50), JobTitle NVARCHAR(50), Username NVARCHAR(50), TotalResultCount INT)

	INSERT INTO @v_people
	SELECT 
	    p.PersonId as [Key],
		p.Name,
		p.Email,
		p.JobTitle,
		p.Username,
		COUNT(*) OVER() AS TotalResultCount
	FROM
		dbo.Person p
	WHERE
		p.PersonId = ISNULL(@p_personId, P.PersonId)
		AND (@p_keywords IS NULL OR p.Name LIKE '%' + @p_keywords + '%')
		AND (
			@p_roleName IS NULL OR EXISTS (
				SELECT 
					1
				FROM
					dbo.[Role] r 
						INNER JOIN dbo.[PersonRole] pr on r.RoleId = pr.RoleId 
				WHERE
					pr.PersonId = p.PersonId AND r.Name LIKE '%' + @p_roleName + '%'
			)
		)
		AND (
			@p_projectLeadExists = 0 
			OR EXISTS (
				SELECT 
					1
				FROM
					dbo.[Project] p2 
				WHERE
					p2.ProjectLeadId = p.PersonId
			)
		)
	ORDER BY
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '0'
			THEN p.Name END ASC,
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '1'
			THEN p.Name END DESC,
		CASE WHEN @p_sortBy = 'username' AND @p_sortDirection = '0'
			THEN p.Username END ASC,
		CASE WHEN @p_sortBy = 'username' AND @p_sortDirection = '1'
			THEN p.Username END DESC
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

	SELECT 
		p.TotalResultCount,
	    p.PersonId as [Key],
		p.Name,
		p.Email,
		p.JobTitle,
		p.Username
	FROM
		@v_people p
	ORDER BY
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '0'
			THEN p.Name END ASC,
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '1'
			THEN p.Name END DESC,
		CASE WHEN @p_sortBy = 'username' AND @p_sortDirection = '0'
			THEN p.Username END ASC,
		CASE WHEN @p_sortBy = 'username' AND @p_sortDirection = '1'
			THEN p.Username END DESC

	SELECT
		pp.PersonProjectId as [Key],
		pp.PersonId as [PersonKey],
		proj.ProjectId as [Key],
		proj.Name
	FROM
		dbo.PersonProjects pp
			INNER JOIN dbo.Project proj on pp.ProjectId = proj.ProjectId
			INNER JOIN @v_people p ON p.PersonId = pp.PersonId
	ORDER BY
		pp.PersonId, p.Name

	SELECT
		pr.PersonRoleId as [Key],
		pr.PersonId as [PersonKey],
		r.RoleId as [Key],
		r.Name
	FROM
		dbo.PersonRole pr
			INNER JOIN @v_people p ON p.PersonId = pr.PersonId
			LEFT OUTER JOIN dbo.[Role] r on pr.RoleId = r.RoleId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Person_Search] TO [WMISUser]
GO