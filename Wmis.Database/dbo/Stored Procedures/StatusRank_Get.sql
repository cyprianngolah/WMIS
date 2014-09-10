CREATE PROCEDURE [dbo].[StatusRank_Get]
AS
	SELECT
		sr.StatusRankId as [Key],
		sr.Name
	FROM
		dbo.StatusRanks sr
	ORDER BY
		sr.StatusRankId 

RETURN 0
GO

GRANT EXECUTE ON [dbo].[StatusRank_Get] TO [WMISUser]
GO