CREATE TYPE [dbo].[Gabs_BatchRejectTableType] AS TABLE 
(
	[AnimalId] [varchar](50) NOT NULL,
	[LastValidLocationDate] [datetime] NOT NULL,
	[RejectReasonId] [int] NOT NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[Gabs_BatchRejectTableType] TO [WMISUser]
GO