CREATE PROCEDURE [dbo].[Biodiversity_Delete]
	@p_speciesId INT = NULL
AS
	
	IF EXISTS(SELECT 1 FROM dbo.Survey WHERE TargetSpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.Survey WHERE TargetSpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.SpeciesSynonyms WHERE SpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.SpeciesReferences WHERE SpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.SpeciesProtectedAreas WHERE SpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.SpeciesPopulations WHERE SpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.SpeciesEcoregions WHERE SpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.Files WHERE SpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.CollaredAnimals WHERE SpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.HistoryLogs WHERE SpeciesId = @p_speciesId)
	OR EXISTS(SELECT 1 FROM dbo.SpeciesEcozones WHERE SpeciesId = @p_speciesId)
		BEGIN
			RAISERROR ('Species cannot be deleted because it is linked to one or more other objects in the system (eg. Collared Animal, References, Survey etc. Please contact WMIS Support', 11,1)
		END
	ELSE
		BEGIN
			DELETE FROM
				dbo.Species
			WHERE
				SpeciesId = @p_speciesId
		END
RETURN 0

GO

GRANT EXECUTE ON [dbo].[Biodiversity_Delete] TO [WMISUser]
GO