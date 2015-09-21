CREATE PROCEDURE [dbo].[ArgosPass_Create]
	@p_collaredAnimalId INT,
	@p_latitude FLOAT,
	@p_longitude FLOAT,
	@p_locationDate DATETIME,
	@p_locationClass NVARCHAR(50)
AS
	INSERT INTO dbo.ArgosPasses (CollaredAnimalId, Latitude, Longitude, LocationDate, LocationClass)
	VALUES (@p_collaredAnimalId, @p_latitude, @p_longitude, @p_locationDate, @p_locationClass)

	SELECT SCOPE_IDENTITY()

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPass_Create] TO [WMISUser]
GO