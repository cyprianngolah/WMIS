CREATE PROCEDURE [dbo].[Site_Save]
	@p_siteId INT,
	@p_siteNumber NVARCHAR(50),
	@p_name NVARCHAR(50) 
	
AS
	IF(@p_siteId IS NULL)
	BEGIN
		INSERT INTO 
			dbo.[Sites] (SiteNumber, Name)
		VALUES
			(@p_siteNumber,@p_name)
	END
	ELSE
	BEGIN
		UPDATE
			dbo.[Sites]
		SET
			SiteNumber = @p_siteId, 
			Name = @p_siteNumber 
		WHERE
			SiteId = @p_siteId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Site_Save] TO [WMISUser]
GO
