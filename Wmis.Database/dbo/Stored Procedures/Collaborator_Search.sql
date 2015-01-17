CREATE PROCEDURE [dbo].[Collaborator_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		c.CollaboratorId as [Key],
		c.Name,
		c.Organization, 
		c.Email, 
		c.PhoneNumber
	FROM
		dbo.Collaborators c
	WHERE
		@p_keywords IS NULL 
		OR c.Name LIKE '%' + @p_keywords + '%'
		OR c.Email LIKE '%' + @p_keywords + '%'
	ORDER BY
		c.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

GO

GRANT EXECUTE ON [dbo].[Collaborator_Search] TO [WMISUser]
GO