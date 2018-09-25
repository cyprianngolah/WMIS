CREATE TYPE [dbo].[Gabs_AnimalIdTableType] AS TABLE(
	[AnimalId] [varchar](50) NOT NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[Gabs_AnimalIdTableType] TO [WMISUser]
GO