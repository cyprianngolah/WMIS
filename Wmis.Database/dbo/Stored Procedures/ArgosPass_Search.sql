CREATE PROCEDURE [dbo].[ArgosPass_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_collarKey int
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		ap.ArgosPassId as [Key],
		ap.CollarId,
		ap.Latitude,
		ap.Longitude,
		ap.LocationDate
	FROM
		dbo.ArgosPasses ap
	WHERE
		ap.CollarId = @p_collarKey
	ORDER BY
		ap.LocationDate DESC
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPass_Search] TO [WMISUser]
GO