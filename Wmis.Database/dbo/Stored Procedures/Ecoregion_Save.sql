CREATE PROCEDURE [dbo].[Ecoregion_Save]
	@p_ecoregionId INT = NULL,
	@p_name NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.Ecoregions WHERE Name = @p_name AND EcoregionId != ISNULL(@p_ecoregionId, EcoregionId))
	BEGIN
		RAISERROR('Name already exists for specified Ecoregion and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_ecoregionId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.Ecoregions (Name)
		VALUES
			(@p_name)		
	END
	ELSE
	BEGIN
		UPDATE
			dbo.Ecoregions
		SET
			Name = @p_name
		WHERE
			EcoregionId = @p_ecoregionId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Ecoregion_Save] TO [WMISUser]
GO