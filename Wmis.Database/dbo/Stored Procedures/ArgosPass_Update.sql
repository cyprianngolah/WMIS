CREATE PROCEDURE [dbo].[ArgosPass_Update]
	@p_argosPasses [ArgosPassTableType] READONLY,
	@p_collarName INT
AS

	DECLARE @v_collarId INT;
	SELECT TOP 1 @v_collarId = CollarId FROM dbo.Collars where Name = @p_collarName;
	
	MERGE ArgosPasses AS T
	USING @p_argosPasses AS S
	ON (T.CollarId = @v_collarId AND T.LocationDate = S.LocationDate) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(CollarId, Latitude, Longitude, LocationDate) VALUES (@v_collarId, S.Latitude, S.Longitude, S.LocationDate);

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPass_Update] TO [WMISUser]
GO