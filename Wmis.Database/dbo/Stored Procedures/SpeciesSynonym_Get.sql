CREATE PROCEDURE [dbo].[SpeciesSynonym_Get]
	@p_speciesId INT,
	@p_speciesSynonymTypeId INT = NULL
AS
	SELECT
		t.SpeciesSynonymId as [Key],
		t.SpeciesSynonymTypeId,
		t.Name
	FROM
		dbo.SpeciesSynonyms t
	WHERE
		t.SpeciesId = @p_speciesId
		AND t.SpeciesSynonymTypeId = ISNULL(@p_speciesSynonymTypeId, t.SpeciesSynonymTypeId)
	ORDER BY
		t.Name

RETURN 0 
GO

GRANT EXECUTE ON [dbo].[SpeciesSynonym_Get] TO [WMISUser]
GO
