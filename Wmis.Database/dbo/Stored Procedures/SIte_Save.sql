CREATE PROCEDURE [dbo].[Site_Save]
	@p_siteId INT,
	@p_siteNumber NVARCHAR(50),
	@p_name NVARCHAR(50),
	@p_projectKey INT,
	@p_latitude FLOAT,
	@p_longitude FLOAT,
	@p_dateEstablished DATE,
	@p_aspect NVARCHAR(50),
	@p_cliffHeight NVARCHAR(50),
	@p_comments NVARCHAR(MAX),
	@p_habitat NVARCHAR(50),
	@p_initialObserver NVARCHAR(50),
	@p_map NVARCHAR(50),
	@p_nearestCommunity NVARCHAR(50),
	@p_nestHeight NVARCHAR(50),
	@p_nestType NVARCHAR(50),
	@p_reference NVARCHAR(100),
	@p_reliability NVARCHAR(50)
	
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
			Longitude = @p_longitude,
			DateEstablished = @p_dateEstablished,
			Aspect = @p_aspect,
			CliffHeight = @p_cliffHeight,
			Comments = @p_comments,
			Habitat = @p_habitat,
			InitialObserver = @p_initialObserver,
			Map = @p_map,
			NearestCommunity = @p_nearestCommunity,
			NestHeight = @p_nestHeight,
			NestType = @p_nestType,
			Reference = @p_reference,
			Reliability = @p_reliability
		WHERE
			SiteId = @p_siteId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Site_Save] TO [WMISUser]
GO
