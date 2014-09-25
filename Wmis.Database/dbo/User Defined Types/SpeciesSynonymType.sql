CREATE TYPE [dbo].[SpeciesSynonymType] AS TABLE 
(
	[Name] NVARCHAR (50) NOT NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[SpeciesSynonymType] TO [WMISUser]
GO