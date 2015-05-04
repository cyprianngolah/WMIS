CREATE PROCEDURE [dbo].[HelpLink_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		h.HelpLinkId as [Key],
		h.Name,
		h.TargetUrl, 
		h.Ordinal
	FROM
		dbo.HelpLink h
	WHERE
		@p_keywords IS NULL 
		OR h.Name LIKE '%' + @p_keywords + '%'
		OR h.TargetUrl LIKE '%' + @p_keywords + '%'
	ORDER BY
		h.Ordinal
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

GO

GRANT EXECUTE ON [dbo].[HelpLink_Search] TO [WMISUser]
GO