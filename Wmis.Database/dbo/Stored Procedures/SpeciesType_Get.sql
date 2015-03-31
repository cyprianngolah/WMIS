CREATE PROCEDURE [dbo].[SpeciesType_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		sp.SpeciesId as [Key],
		sp.Name,
		COALESCE(sp.CommonName, sp.Name) AS CommonName
	FROM
		dbo.Species sp
	ORDER BY
		sp.CommonName
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

GO

GRANT EXECUTE ON [dbo].[SpeciesType_Get] TO [WMISUser]
GO
