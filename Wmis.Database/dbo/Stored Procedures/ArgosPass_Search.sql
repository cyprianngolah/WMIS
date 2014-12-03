CREATE PROCEDURE [dbo].[ArgosPass_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_collaredAnimalKey int,
	@p_argosPassStatusFilter bit
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		ap.ArgosPassId as [Key],
		ap.CollaredAnimalId,
		ap.Latitude,
		ap.Longitude,
		ap.LocationDate,
		argosPassStatus.ArgosPassStatusId as [Key],
		argosPassStatus.Name,
		argosPassStatus.isRejected
	FROM
		dbo.ArgosPasses ap
		LEFT OUTER JOIN dbo.ArgosPassStatuses argosPassStatus on ap.ArgosPassStatusId = argosPassStatus.ArgosPassStatusId
	WHERE
		ap.CollaredAnimalId = @p_collaredAnimalKey
		AND (@p_argosPassStatusFilter IS NULL OR @p_argosPassStatusFilter = argosPassStatus.isRejected)
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