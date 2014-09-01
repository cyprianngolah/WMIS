CREATE PROCEDURE [dbo].[TaxonomyGroups_Get]
	@p_taxonomyGroupId INT = NULL
AS
	SELECT 
		TaxonomyGroupId as [Key],
		Name
	FROM
		dbo.TaxonomyGroups	
	WHERE
		TaxonomyGroupId = ISNULL(@p_taxonomyGroupId, TaxonomyGroupId)
	ORDER BY 
		Name

RETURN 0

GRANT EXECUTE ON [dbo].[TaxonomyGroups_Get] TO [WMISUser]
GO