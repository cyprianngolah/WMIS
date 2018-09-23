CREATE PROCEDURE [dbo].[ArgosPass_Search]
	@p_startRow INT = 0,
	@p_rowCount INT = 25,
	@p_collaredAnimalKey INT,
	@p_argosPassStatusFilter INT = null,
	@p_daysStart DateTime = null,
	@p_daysEnd DateTime = null,
	@p_showGpsOnly BIT = 0
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		ap.ArgosPassId as [Key],
		ap.CollaredAnimalId,
		ap.Latitude,
		ap.Longitude,
		ap.LocationDate,
		ap.LocationClass,
		ap.CepRadius,
		ap.Comment,
		ap.ManualQA,
		ap.IsLastValidLocation,
		argosPassStatus.ArgosPassStatusId as [Key],
		argosPassStatus.Name,
		argosPassStatus.isRejected
	FROM
		dbo.ArgosPasses ap
		LEFT OUTER JOIN dbo.ArgosPassStatuses argosPassStatus on ap.ArgosPassStatusId = argosPassStatus.ArgosPassStatusId
	WHERE
		ap.CollaredAnimalId = @p_collaredAnimalKey
		AND (@p_argosPassStatusFilter IS NULL OR argosPassStatus.isRejected = @p_argosPassStatusFilter)
		AND (@p_daysStart IS NULL OR ap.LocationDate >= @p_daysStart)
		AND
		(
			@p_showGpsOnly IS NULL
			OR 
			(
				ap.LocationClass = 'G'
			)
		)
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