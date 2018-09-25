CREATE PROCEDURE [dbo].[ArgosPassFlag_Update]
	@p_CollaredAnimalId INT
AS
	-- Clear all flagged locations for this animal for the past 60 days which have
	-- a flag of 'Greater than x days
	UPDATE ArgosPasses
	SET ArgosPassStatusId = NULL,
		Comment = NULL
	WHERE Comment LIKE '%day(s) from previous%'
	AND LocationDate >= (GETDATE()-60)
	AND CollaredAnimalId = @p_CollaredAnimalId
	AND IsLastValidLocation <> 1
	AND LocationClass = 'G'


	;WITH CTE AS(
		SELECT	ArgosPassId, 
				CollaredAnimalId,
				latitude,
				longitude,
				LocationDate,
				ArgosPassStatusId,
				Comment,
				LEAD(LocationDate, 1) OVER (PARTITION BY CollaredAnimalId ORDER BY locationDate DESC) PreviousDate
		FROM ArgosPasses
		WHERE LocationClass='G'
		AND (
			ArgosPassStatusId NOT IN (
				SELECT ArgosPassStatusId
				FROM ArgosPassStatuses
				WHERE isRejected = 1
			) 
			OR ArgosPassStatusId IS NULL 
		)
		AND CollaredAnimalId = @p_CollaredAnimalId
		AND LocationDate >= (GETDATE()-60) -- limit to 60 days ago
	)
	,DATEDIFFERENCE AS
	(
		SELECT  ArgosPassId, CollaredAnimalId, ArgosPassStatusId,
				DATEDIFF(day, PreviousDate, LocationDate) DifferenceInDays,
				LocationDate, PreviousDate, Comment
		FROM CTE
	)
	--,SANITIZED AS
	--(
	--	SELECT *
	--	FROM DATEDIFFERENCE
	--	WHERE (Comment NOT LIKE '%day(s) from previous%' OR COMMENT IS NULL)
	--)
	UPDATE ap 
	SET 
		ap.Comment = CASE WHEN dd.Comment IS NULL
			THEN 
				CONCAT('Flagged during import:', dd.DifferenceInDays, ' day(s) from previous valid location')
			ELSE 
				CONCAT(dd.Comment, '; Flagged during import:', dd.DifferenceInDays, ' day(s) from previous valid location')
			END,
		ap.ArgosPassStatusId = 5,
		ap.ManualQA = 'true'
	FROM ArgosPasses ap
	INNER JOIN DATEDIFFERENCE dd
		ON (ap.ArgosPassId = dd.ArgosPassId)
	WHERE dd.DifferenceInDays > 5
RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPassFlag_Update] TO [WMISUser]
GO