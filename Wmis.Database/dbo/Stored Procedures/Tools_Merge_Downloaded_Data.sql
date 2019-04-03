CREATE PROCEDURE [dbo].[Tools_Merge_Downloaded_Data]
	@p_data [DownloadedArgosPassTableType] READONLY
AS
	DECLARE @CTN AS VARCHAR(50)
	DECLARE @collaredAnimalId AS INTEGER
	
	SELECT TOP 1 @CTN = CTN
	FROM @p_data

	SELECT TOP 1 @collaredAnimalId = CollaredAnimalId
	FROM CollaredAnimals
	WHERE CollarId LIKE @CTN + '%'

	IF @collaredAnimalId IS NOT NULL
	BEGIN
		MERGE ArgosPasses AS T
		USING @p_data AS S
		ON (T.CollaredAnimalId = @collaredAnimalId 
			AND T.LocationDate = S.[Timestamp]
			AND S.GpsLatitude <> 9999
			AND S.GpsLongitude <> 9999) 
		WHEN NOT MATCHED BY TARGET 
			THEN INSERT(CollaredAnimalId, Latitude, Longitude, LocationDate, LocationClass, Comment) 
					VALUES (@collaredAnimalId, S.GpsLatitude, S.GpsLongitude, S.[Timestamp], S.LocationClass, 'Downloaded from collar after retrieval');
		
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Tools_Merge_Downloaded_Data] TO [WMISUser]
GO