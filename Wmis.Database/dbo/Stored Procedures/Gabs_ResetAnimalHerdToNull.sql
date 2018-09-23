CREATE PROCEDURE [dbo].[Gabs_ResetAnimalHerdToNull]
	@List AS [dbo].[Gabs_AnimalIdTableType] READONLY
AS
	SET NOCOUNT ON;
	UPDATE collaredAnimals
	SET	HerdPopulationId = NULL
	WHERE AnimalId IN (SELECT AnimalId from @List);
	
RETURN 0

GO

GRANT EXECUTE ON [dbo].[Gabs_ResetAnimalHerdToNull] TO [WMISUser]
GO