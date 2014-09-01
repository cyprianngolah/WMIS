CREATE PROCEDURE [dbo].[Taxonomy_Save]
	@p_taxonomyId INT = NULL,
	@p_taxonomyGroupId INT,
	@p_name NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.Taxonomy WHERE TaxonomyGroupId = @p_taxonomyGroupId AND Name = @p_name AND TaxonomyId != ISNULL(@p_taxonomyId,TaxonomyId))
	BEGIN
		RAISERROR('Taxonomy Name already exists for specified Taxonomy Group and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_taxonomyId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.Taxonomy (TaxonomyGroupId, Name)
		VALUES
			(@p_taxonomyGroupId, @p_name)		
	END
	ELSE
	BEGIN
		UPDATE
			dbo.Taxonomy
		SET
			TaxonomyGroupId = @p_taxonomyGroupId,
			Name = @p_name
		WHERE
			TaxonomyId = @p_taxonomyId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Taxonomy_Save] TO [WMISUser]
GO