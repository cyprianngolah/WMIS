CREATE PROCEDURE [dbo].[Gabs_InsertVectronicsData]
	@List AS [dbo].[Gabs_VectronicsArgosPassTableType] READONLY
AS
	SET NOCOUNT ON;
	WITH CTE AS(
		SELECT	ca.CollaredAnimalId,
				l.Latitude,
				l.Longitude,
				l.LocationDate,
				l.LocationClass 
		FROM	collaredAnimals ca
		INNER JOIN @List l
			ON(ca.AnimalId = l.AnimalId)
	)
	MERGE ArgosPasses AS T
	USING CTE AS S 
		ON(
			T.CollaredAnimalId = S.CollaredAnimalId
			AND T.LocationDate = S.LocationDate
			AND T.Latitude = S.Latitude
			AND T.Longitude = S.Longitude
		)
	WHEN NOT MATCHED BY TARGET
		THEN INSERT(CollaredAnimalId, Latitude, Longitude, LocationDate, LocationClass)
			VALUES(S.CollaredAnimalId, S.Latitude, S.Longitude, S.LocationDate, S.LocationClass);
RETURN 0

GO

GRANT EXECUTE ON [dbo].[Gabs_InsertVectronicsData] TO [WMISUser]
GO