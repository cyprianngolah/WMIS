CREATE PROCEDURE [dbo].[ArgosProgram_GetAll] AS
	
	SELECT 
		ap.ArgosProgramId AS [Key],
		ap.ProgramNumber,
		au.ArgosUserId AS [Key],
		au.Name,
		au.Password
	FROM dbo.ArgosPrograms ap
		INNER JOIN dbo.ArgosUsers au ON (ap.ArgosUserId = au.ArgosUserId)

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosProgram_GetAll] TO [WMISUser]
GO