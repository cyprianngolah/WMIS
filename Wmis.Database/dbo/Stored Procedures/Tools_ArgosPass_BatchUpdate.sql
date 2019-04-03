CREATE PROCEDURE [dbo].[Tools_ArgosPass_BatchUpdate]
	@p_list AS [dbo].[Gabs_BatchRejectTableType] READONLY
AS
	SET NOCOUNT ON;
	
	DECLARE @CollaredAnimalList TABLE(
		CollaredAnimalId int,
		AnimalId varchar(20),
		LastValidLocationDate datetime,
		RejectReasonId int
	)
	INSERT INTO @CollaredAnimalList
		SELECT	ca.CollaredAnimalId, 
				ca.AnimalId, 
				l.LastValidLocationDate,
				l.RejectReasonId
		FROM	collaredAnimals ca
		INNER JOIN @p_list l
			ON(ca.AnimalId = l.AnimalId)

	UPDATE ap
	SET
		ap.ArgosPassStatusId = aps.ArgosPassStatusId,
		ap.ManualQA = 1
	FROM ArgosPasses ap
	INNER JOIN @CollaredAnimalList ca
		ON(ap.CollaredAnimalId = ca.CollaredAnimalId)
	INNER JOIN ArgosPassStatuses aps
		ON(ca.RejectReasonId = aps.ArgosPassStatusId)
	WHERE
		ap.LocationDate > ca.LastValidLocationDate
	AND (ap.Comment NOT LIKE '%last location%' OR ap.Comment is null);
RETURN 1

GO

GRANT EXECUTE ON [dbo].[Tools_ArgosPass_BatchUpdate] TO [WMISUser]
GO