CREATE PROCEDURE [dbo].[Users_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT 
		COUNT(*) OVER() AS ResultCount,
		UserId as [Key], 
		Username, 
		FirstName,
		LastName,
		AdministratorProjects,
		AdministratorBiodiversity
	FROM
		dbo.Users 
	WHERE
		@p_keywords IS NULL 
		OR @p_keywords LIKE '%' + Username + '%' 
		OR @p_keywords LIKE '%' + FirstName + '%' 
		OR @p_keywords LIKE '%' + LastName + '%' 
	ORDER BY
		Username
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY
GO

GRANT EXECUTE ON [dbo].[Users_Search] TO [WMISUser]
GO
