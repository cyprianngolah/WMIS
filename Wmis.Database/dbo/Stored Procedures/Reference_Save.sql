CREATE PROCEDURE [dbo].[Reference_Save]
	@p_referenceId INT,
	@p_code NVARCHAR(50), 
	@p_author NVARCHAR(255),
	@p_year INT,
	@p_title NVARCHAR(255),
	@p_editionPublicationOrganization NVARCHAR(255),
	@p_volumePage NVARCHAR(255),
	@p_publisher NVARCHAR(255),
	@p_city NVARCHAR(255),
	@p_location NVARCHAR(255)
AS
	IF(@p_referenceId IS NULL)
	BEGIN
		INSERT INTO 
			dbo.[References] (Code, Author, [Year], Title, EditionPublicationOrganization, VolumePage, Publisher, City, Location)
		VALUES
			(@p_code, @p_author, @p_year, @p_title, @p_editionPublicationOrganization, @p_volumePage, @p_publisher, @p_city, @p_location)
	END
	ELSE
	BEGIN
		UPDATE
			dbo.[References]
		SET
			Code = @p_code, 
			Author = @p_author, 
			[Year] = @p_year, 
			Title = @p_title, 
			EditionPublicationOrganization = @p_editionPublicationOrganization, 
			VolumePage = @p_volumePage, 
			Publisher = @p_publisher, 
			City = @p_city, 
			Location = @p_location
		WHERE
			ReferenceId = @p_referenceId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Reference_Save] TO [WMISUser]
GO