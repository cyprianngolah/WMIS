CREATE TYPE [dbo].[Gabs_VectronicsArgosPassTableType] AS TABLE(
	[AnimalId] [varchar](50) NOT NULL,
	[Latitude] [float] NOT NULL,
	[Longitude] [float] NOT NULL,
	[LocationDate] [datetime] NOT NULL,
	[LocationClass] [nvarchar](50) NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[Gabs_VectronicsArgosPassTableType] TO [WMISUser]
GO