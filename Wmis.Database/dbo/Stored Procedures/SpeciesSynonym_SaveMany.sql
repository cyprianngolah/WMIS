CREATE PROCEDURE [dbo].[SpeciesSynonym_SaveMany]
	@p_speciesId INT,
	@p_speciesSynonymTypeId INT,
	@p_speciesSynonyms SpeciesSynonymType READONLY
AS
	MERGE INTO 
		[dbo].[SpeciesSynonyms] AS [target]
	USING 
		@p_speciesSynonyms AS [source] ON [target].[SpeciesId] = @p_speciesId AND [target].[SpeciesSynonymTypeId] = @p_speciesSynonymTypeId AND [target].[Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT ([SpeciesId], [SpeciesSynonymTypeId], [Name]) VALUES (@p_speciesId, @p_speciesSynonymTypeId, [source].[Name]) 
	WHEN NOT MATCHED BY SOURCE 
		AND [target].[SpeciesId] = @p_speciesId 
		AND [target].[SpeciesSynonymTypeId] = @p_speciesSynonymTypeId 
		THEN DELETE;

RETURN 0
GO

GRANT EXECUTE ON [dbo].[SpeciesSynonym_SaveMany] TO [WMISUser]
GO