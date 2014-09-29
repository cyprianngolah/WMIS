CREATE PROCEDURE [dbo].[LeadRegion_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_leadRegionId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		lr.LeadRegionId as [Key],
		lr.Name
	FROM
		dbo.LeadRegion lr
	WHERE
		lr.LeadRegionId = ISNULL(@p_leadRegionId, lr.LeadRegionId)
		AND (@p_keywords IS NULL OR lr.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		lr.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

GO

GRANT EXECUTE ON [dbo].[LeadRegion_Search] TO [WMISUser]
GO