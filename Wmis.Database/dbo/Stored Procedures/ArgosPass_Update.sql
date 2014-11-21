CREATE PROCEDURE [dbo].[ArgosPass_Update]
	@p_argosPasses [ArgosPassTableType] READONLY,
	@p_collarId INT
AS

	DECLARE @v_collaredAnimalId INT;
	SELECT TOP 1 @v_collaredAnimalId = CollaredAnimalId FROM dbo.CollaredAnimals where CollarId = @p_collarId
	
	MERGE ArgosPasses AS T
	USING @p_argosPasses AS S
	ON (T.CollaredAnimalId = @v_collaredAnimalId AND T.LocationDate = S.LocationDate) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(CollaredAnimalId, Latitude, Longitude, LocationDate) VALUES (@v_collaredAnimalId, S.Latitude, S.Longitude, S.LocationDate);

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPass_Update] TO [WMISUser]
GO