CREATE PROCEDURE [dbo].[Taxonomy_Get]
	@p_taxonomyId INT = NULL,
	@p_taxonomyGroupId INT = NULL
AS
	SELECT
		t.TaxonomyId  as [Key],
		t.TaxonomyGroupId, 
		t.Name
	FROM
		dbo.Taxonomy t
	WHERE
		t.TaxonomyId = ISNULL(@p_taxonomyId, t.TaxonomyId)
		AND t.TaxonomyGroupId = ISNULL(@p_taxonomyGroupId, t.TaxonomyGroupId )
	ORDER BY
		t.Name

RETURN 0