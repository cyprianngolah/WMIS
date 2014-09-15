CREATE TYPE [dbo].[IntTableType] AS TABLE 
( 
	[n] INT
)
GO

GRANT EXECUTE ON TYPE::[dbo].[IntTableType] TO [WMISUser]
GO