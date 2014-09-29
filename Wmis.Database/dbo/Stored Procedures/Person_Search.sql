CREATE PROCEDURE [dbo].[Person_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_personId INT = NULL,
	@p_roleName NVARCHAR(50) = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		p.PersonId as [Key],
		p.Name,
		p.Email
	FROM
		dbo.Person p
	WHERE
		p.PersonId = ISNULL(@p_personId, P.PersonId)
		AND (@p_keywords IS NULL OR p.Name LIKE '%' + @p_keywords + '%' OR p.Email LIKE '%' + @p_keywords + '%')
		AND (
			@p_roleName IS NULL OR EXISTS (
				SELECT 
					1
				FROM
					dbo.[Role] r 
						INNER JOIN dbo.[PersonRole] pr on r.RoleId = pr.RoleId 
				WHERE
					pr.PersonId = p.PersonId
			)
		)
	ORDER BY
		p.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY
RETURN 0
GO

GRANT EXECUTE ON [dbo].[Person_Search] TO [WMISUser]
GO