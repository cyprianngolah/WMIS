CREATE PROCEDURE [dbo].[BiodiversityBulkSpecies_Merge]
	@p_speciesList AS [dbo].[BulkSpeciesUploadTableType] READONLY
AS
	DECLARE @group_tax_group_id int;
	SET @group_tax_group_id = (SELECT TOP(1) TaxonomyGroupId FROM TaxonomyGroups WHERE NAME = 'Group');

	DECLARE @kingdom_tax_group_id int;
	SET @kingdom_tax_group_id = (SELECT TOP(1) TaxonomyGroupId FROM TaxonomyGroups WHERE NAME = 'Kingdom');

	DECLARE @phylum_tax_group_id int;
	SET @phylum_tax_group_id = (SELECT TOP(1) TaxonomyGroupId FROM TaxonomyGroups WHERE NAME = 'Phylum');

	DECLARE @class_tax_group_id int;
	SET @class_tax_group_id = (SELECT TOP(1) TaxonomyGroupId FROM TaxonomyGroups WHERE NAME = 'Class');

	DECLARE @order_tax_group_id int;
	SET @order_tax_group_id = (SELECT TOP(1) TaxonomyGroupId FROM TaxonomyGroups WHERE NAME = 'Order');

	DECLARE @family_tax_group_id int;
	SET @family_tax_group_id = (SELECT TOP(1) TaxonomyGroupId FROM TaxonomyGroups WHERE NAME = 'Family');


	-- Get all the Taxonomy groups and insert if they do not yet exist on the taxonomy table
	;WITH CTE AS(
		SELECT DISTINCT @group_tax_group_id TaxGroupId, [Group] Name FROM @p_speciesList WHERE [Group] IS NOT NULL
		UNION
		SELECT DISTINCT @kingdom_tax_group_id, [Kingdom] FROM @p_speciesList WHERE [Kingdom] IS NOT NULL
		UNION
		SELECT DISTINCT @phylum_tax_group_id, [Phylum] FROM @p_speciesList WHERE [Phylum] IS NOT NULL
		UNION
		SELECT DISTINCT @class_tax_group_id, [Class] FROM @p_speciesList WHERE [Class] IS NOT NULL
		UNION
		SELECT DISTINCT @order_tax_group_id, [Order] FROM @p_speciesList WHERE [Order] IS NOT NULL
		UNION
		SELECT DISTINCT @family_tax_group_id, [Family] FROM @p_speciesList WHERE [Family] IS NOT NULL
	)
	MERGE Taxonomy AS T
	USING CTE AS S
	ON (T.TaxonomyGroupId = S.TaxGroupId AND T.Name = S.Name)
	WHEN NOT MATCHED BY TARGET
		THEN INSERT(TaxonomyGroupId, Name) VALUES(S.TaxGroupId, S.Name);
	
	-- Insert the Species information (Family, etc)
	;WITH data as(
		SELECT	DISTINCT 
				f.TaxonomyId AS FamilyTaxonomyId,
				o.TaxonomyId AS OrderTaxonomyId,
				c.TaxonomyId AS ClassTaxonomyId,
				p.TaxonomyId AS PhylumTaxonomyId,
				k.TaxonomyId AS KingdomTaxonomyId,
				g.TaxonomyId AS GroupTaxonomyId,
				sl.Name,
				sl.CommonName,
				sl.ELCode,
				s1.RangeExtentScore,
				s1.RangeExtentDescription,
				s1.NumberOfOccurencesScore,
				s1.NumberOfOccurencesDescription,
				s1.StatusRankId,
				s1.StatusRankDescription,
				s1.SRank,
				s1.DecisionProcessDescription
		FROM @p_speciesList sl
		LEFT JOIN (SELECT * FROM Taxonomy WHERE TaxonomyGroupId = @family_tax_group_id) AS f ON(sl.Family = f.Name)
		LEFT JOIN (SELECT * FROM Taxonomy WHERE TaxonomyGroupId = @order_tax_group_id) AS o ON(sl.[Order] = o.Name)
		LEFT JOIN (SELECT * FROM Taxonomy WHERE TaxonomyGroupId = @class_tax_group_id) AS c ON(sl.[Class] = c.Name)
		LEFT JOIN (SELECT * FROM Taxonomy WHERE TaxonomyGroupId = @phylum_tax_group_id) AS p ON(sl.[Phylum] = p.Name)
		LEFT JOIN (SELECT * FROM Taxonomy WHERE TaxonomyGroupId = @kingdom_tax_group_id) AS k ON(sl.[Kingdom] = k.Name)
		LEFT JOIN (SELECT * FROM Taxonomy WHERE TaxonomyGroupId = @group_tax_group_id) AS g ON(sl.[Group] = g.Name)
	)
	MERGE Species AS T
	USING data as S
	ON (
		T.Name = S.Name 
		AND T.FamilyTaxonomyId = S.FamilyTaxonomyId 
		--AND T.ELCODE = S.ELCode
	)
	WHEN NOT MATCHED BY TARGET THEN
		INSERT(Name, CommonName, ELCode, FamilyTaxonomyId, GroupTaxonomyId, KingdomTaxonomyId, PhylumTaxonomyId, ClassTaxonomyId, OrderTaxonomyId,RangeExtentScore,RangeExtentDescription,NumberOfOccurencesScore,NumberOfOccurencesDescription,StatusRankId,StatusRankDescription,SRank,DecisionProcessDescription)
		VALUES(S.Name, S.CommonName, S.ELCode, S.FamilyTaxonomyId, S.GroupTaxonomyId, S.KingdomTaxonomyId, S.PhylumTaxonomyId, S.ClassTaxonomyId, S.OrderTaxonomyId,S.RangeExtentScore,S.RangeExtentDescription,S.NumberOfOccurencesScore,S.NumberOfOccurencesDescription,S.StatusRankId,S.StatusRankDescription,S.SRank,S.DecisionProcessDescription);

RETURN 0