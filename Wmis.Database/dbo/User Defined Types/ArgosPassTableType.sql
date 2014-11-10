CREATE TYPE [dbo].[ArgosPassTableType] AS TABLE 
(
	[Latitude]      FLOAT       NOT NULL,
	[Longitude]     FLOAT       NOT NULL,
	[LocationDate]  DATETIME    NOT NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[ArgosPassTableType] TO [WMISUser]
GO