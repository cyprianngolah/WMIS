CREATE PROCEDURE [dbo].[Tools_InsertLotekData]
	@p_data AS [dbo].[Gabs_LotekIridiumPassTableType] READONLY
AS
	SET NOCOUNT ON;
	WITH CTE AS(
		SELECT	ca.CollaredAnimalId,
				l.Latitude,
				l.Longitude,
				l.LocationDate,
				l.LocationClass 
		FROM	collaredAnimals ca
		INNER JOIN @p_data l
			ON(ca.CollarId = l.CollarId)
	)
	MERGE ArgosPasses AS T
	USING CTE AS S 
		ON(
			T.CollaredAnimalId = S.CollaredAnimalId
			AND T.LocationDate = S.LocationDate
			AND T.Latitude = S.Latitude
			AND T.Longitude = S.Longitude
			AND S.Longitude <> 9999
			AND S.Latitude <> 9999
		)
	WHEN NOT MATCHED BY TARGET
		THEN INSERT(CollaredAnimalId, Latitude, Longitude, LocationDate, LocationClass)
			VALUES(S.CollaredAnimalId, S.Latitude, S.Longitude, S.LocationDate, S.LocationClass);
			
RETURN 0

GO

GRANT EXECUTE ON [dbo].[Gabs_LotekIridiumPassTableType] TO [WMISUser]
GO