CREATE TYPE [dbo].[NameTableType] AS TABLE 
(
	[Name] NVARCHAR (50) NOT NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[NameTableType] TO [WMISUser]
GO