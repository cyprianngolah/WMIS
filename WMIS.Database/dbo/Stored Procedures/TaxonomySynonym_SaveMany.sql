CREATE PROCEDURE [dbo].[TaxonomySynonym_SaveMany]
	@p_taxonomyId INT,
	@p_taxonomySynonyms TaxonomySynonymType READONLY
AS
MERGE INTO 
	[dbo].[TaxonomySynonyms] AS [target]
USING 
	@p_taxonomySynonyms AS [source] ON [target].[TaxonomyId] = @p_taxonomyId AND [target].[Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET 
	THEN INSERT ([TaxonomyId], [Name]) VALUES (@p_taxonomyId, [source].[Name]) 
WHEN NOT MATCHED BY SOURCE 
	AND [target].[TaxonomyId] = @p_taxonomyId 
	THEN DELETE;

GO

GRANT EXECUTE ON [dbo].[TaxonomySynonym_SaveMany] TO [WMISUser]

GO
