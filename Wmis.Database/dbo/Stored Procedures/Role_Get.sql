CREATE PROCEDURE [dbo].[Role_Get]
AS
	SELECT
		r.RoleId as [Key],
		r.Name
	FROM
		[dbo].[Role] r
GO

GRANT EXECUTE ON [dbo].[Role_Get] TO [WMISUser]
GO