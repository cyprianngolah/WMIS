CREATE PROCEDURE [dbo].[ReferenceYears_Get]
AS
	SELECT Distinct
		[Year]
	FROM
		[dbo].[References] 
	where [Year] is not null
	Order by [Year] desc
GO

GRANT EXECUTE ON [dbo].[ReferenceYears_Get] TO [WMISUser]
GO