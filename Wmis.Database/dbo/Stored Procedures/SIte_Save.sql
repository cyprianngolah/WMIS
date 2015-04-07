CREATE PROCEDURE [dbo].[Site_Save]
	@p_siteId INT,
	@p_siteNumber NVARCHAR(50),
	@p_name NVARCHAR(50),
	@p_projectKey INT,
	@p_latitude FLOAT,
	@p_longitude FLOAT
	
AS
	IF(@p_siteId IS NULL)
	BEGIN
		INSERT INTO 
			dbo.[Sites] (SiteNumber, Name, ProjectId, Latitude, Longitude)
		VALUES
			(@p_siteNumber,@p_name,@p_projectKey,@p_latitude,@p_longitude)
	END
	ELSE
	BEGIN
		UPDATE
			dbo.[Sites]
		SET
			SiteNumber = @p_siteNumber, 
			Name = @p_name,
			Latitude = @p_latitude,
			Longitude = @p_longitude
		WHERE
			SiteId = @p_siteId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Site_Save] TO [WMISUser]
GO
