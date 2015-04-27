CREATE PROCEDURE [dbo].[BioDiversity_Create]
	@p_name NVARCHAR(50),
	@p_subSpeciesName NVARCHAR(50),
    @p_ecoType NVARCHAR(50),
	@p_createdBy NVARCHAR (50)
AS
	INSERT INTO dbo.Species (Name, SubSpeciesName, EcoType, LastUpdated)
	VALUES (@p_name, @p_subSpeciesName, @p_ecoType, GETUTCDATE())

	SELECT SCOPE_IDENTITY()
	
	--History Log - Biodiversity Created
	INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES ((SELECT SCOPE_IDENTITY()), "Biodiversity Created", GETUTCDATE(), @p_createdBy)

RETURN 0
GO

GRANT EXECUTE ON [dbo].[BioDiversity_Create] TO [WMISUser]
GO