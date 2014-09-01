CREATE TYPE [dbo].[TaxonomySynonymType] AS TABLE (
	[Name] NVARCHAR (50) NOT NULL)

GO

GRANT EXECUTE ON TYPE::[dbo].[TaxonomySynonymType] TO [WMISUser]

GO
