CREATE PROCEDURE [dbo].[Gabs_ArgosPass_RejectExactDuplicates]
AS
	;WITH cte AS(
		SELECT	argosPassId, 
				collaredAnimalId, 
				LocationDate, 
				CONVERT(VARCHAR(16), LocationDate, 120) roundedDateTime, 
				comment, 
				ROUND(Latitude, 4, 1) lat, 
				ROUND(Longitude, 4, 1) lon
		from ArgosPasses
	)
	,duplicates as(
		SELECT	argosPassId, 
				CollaredAnimalId, 
				LocationDate, 
				roundedDateTime, 
				comment, 
				lat, 
				lon, 
				row_number() OVER(partition by CollaredAnimalId, roundedDateTime, lat, lon order by roundedDateTime, comment, lat, lon) rn
		FROM cte
	)
	UPDATE ap
	SET ArgosPassStatusId = 11,
		Comment = 'Duplicate entry',
		ManualQA = 1
	-- SELECT *
	FROM ArgosPasses ap
	INNER JOIN duplicates
		ON( ap.ArgosPassId = duplicates.ArgosPassId )
	WHERE (
			ap.ArgosPassStatusId NOT IN (
				SELECT ArgosPassStatusId
				FROM ArgosPassStatuses
				WHERE isRejected = 1
			) 
			OR ap.ArgosPassStatusId IS NULL
		)
	AND duplicates.rn > 1;
RETURN 0

GO

GRANT EXECUTE ON [dbo].[Gabs_ArgosPass_RejectExactDuplicates] TO [WMISUser]

GO