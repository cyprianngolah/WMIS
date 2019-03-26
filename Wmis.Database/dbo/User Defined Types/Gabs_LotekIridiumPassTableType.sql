CREATE TYPE [dbo].[Gabs_LotekIridiumPassTableType] AS TABLE(
	[CollarId] [varchar](50) NOT NULL,
	[Latitude] [float] NOT NULL,
	[Longitude] [float] NOT NULL,
	[LocationDate] [datetime] NOT NULL,
	[LocationClass] [nvarchar](50) NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[Gabs_LotekIridiumPassTableType] TO [WMISUser]
GO