CREATE PROCEDURE [dbo].[TaxonomySynonym_Get]
	@p_taxonomyId INT
AS
	SELECT
		t.TaxonomySynonymId as [Key],
		t.TaxonomyId,
		t.Name
	FROM
		dbo.TaxonomySynonyms t
	WHERE
		t.TaxonomyId = @p_taxonomyId
	ORDER BY
		t.Name

RETURN 0 
GO

GRANT EXECUTE ON [dbo].[TaxonomySynonym_Get] TO [WMISUser]
GO
