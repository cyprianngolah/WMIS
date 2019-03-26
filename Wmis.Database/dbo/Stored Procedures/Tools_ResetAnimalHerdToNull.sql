CREATE PROCEDURE [dbo].[Tools_ResetAnimalHerdToNull]
	@p_list AS [dbo].[Gabs_AnimalIdTableType] READONLY
AS
	SET NOCOUNT ON;
	UPDATE collaredAnimals
	SET	HerdPopulationId = NULL
	WHERE AnimalId IN (SELECT AnimalId from @p_list);
RETURN 0

GO

GRANT EXECUTE ON [dbo].[Tools_ResetAnimalHerdToNull] TO [WMISUser]
GO