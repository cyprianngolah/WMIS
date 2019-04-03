CREATE PROCEDURE [dbo].[Tools_ArgosPass_RejectLocationsAfterInactiveDate]	
AS
	DECLARE @RejectDates TABLE(
		CollaredAnimalId INT,
		LastValidLocationdate DATETIME NULL,
		IsLastValidLocation BIT NULL
	)

	;WITH CollarsWithLastValidLocation AS(
		SELECT CollaredAnimalId, LocationDate, IsLastValidLocation, ArgosPassId
		FROM ArgosPasses
		WHERE IsLastValidLocation = 1
	)
	INSERT INTO @RejectDates(CollaredAnimalId, LastValidLocationdate, IsLastValidLocation)
		SELECT ca.CollaredAnimalId, 
			CASE WHEN cv.IsLastValidLocation = 1 THEN 
				cv.LocationDate
			ELSE 
				ca.InactiveDate
			END, 
			cv.IsLastValidLocation
		FROM CollaredAnimals ca
		LEFT JOIN CollarsWithLastValidLocation cv
			ON(ca.CollaredAnimalId = cv.CollaredAnimalId)
		WHERE (
			(ca.CollaredAnimalId IN (
							SELECT CollaredAnimalId from CollarsWithLastValidLocation)
						)
			OR
			(ca.InactiveDate IS NOT NULL)
		) 
	--SELECT *
	--FROM @RejectDates
	-- remove all "post-inactive date" flags for these animals 
	-- before updating again. This ensures that any possible gap fills or changes in 
	-- the LastValidLocation are reflected in the check

	UPDATE ArgosPasses
	SET ArgosPassStatusId = NULL,
		Comment = NULL
	WHERE CollaredAnimalId IN (SELECT CollaredAnimalId FROM @RejectDates)
	AND Comment LIKE '%Post-inactive date%'

	-- Update the flags
	UPDATE ap 
	SET ap.ArgosPassStatusId = 11,
		ap.Comment = 'Post-inactive date',
		ap.ManualQA = 1
	FROM @RejectDates rd
	INNER JOIN ArgosPasses ap
		ON( rd.CollaredAnimalId = ap.CollaredAnimalId )
	WHERE (
			ap.ArgosPassStatusId NOT IN (
				SELECT ArgosPassStatusId
				FROM ArgosPassStatuses
				WHERE isRejected = 1
			)
			OR ap.ArgosPassStatusId IS NULL
		)
	AND ap.LocationDate > LastValidLocationdate;

	SELECT @@ROWCOUNT
RETURN 0

GO

GRANT EXECUTE ON [dbo].[Tools_ArgosPass_RejectLocationsAfterInactiveDate] TO [WMISUser]
GO