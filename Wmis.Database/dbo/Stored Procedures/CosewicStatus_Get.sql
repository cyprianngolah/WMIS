CREATE PROCEDURE [dbo].[CosewicStatus_Get]
AS
	SELECT
		cs.[COSEWICStatusId] as [Key],
		cs.Name
	FROM
		dbo.CosewicStatus cs
	ORDER BY
		cs.[COSEWICStatusId]

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CosewicStatus_Get] TO [WMISUser]
GO