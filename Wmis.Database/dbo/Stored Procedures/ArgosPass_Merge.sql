CREATE PROCEDURE [dbo].[ArgosPass_Merge]
	@p_argosPasses [ArgosPassTableType] READONLY,
	@p_collaredAnimalId INT
AS

	MERGE ArgosPasses AS T
	USING @p_argosPasses AS S
	ON (T.CollaredAnimalId = @p_collaredAnimalId AND T.LocationDate = S.LocationDate) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(CollaredAnimalId, Latitude, Longitude, LocationDate) VALUES (@p_collaredAnimalId, S.Latitude, S.Longitude, S.LocationDate);

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPass_Merge] TO [WMISUser]
GO