CREATE TYPE [dbo].[ReferenceTableType] AS TABLE 
(
	[Code]      NVARCHAR(50)       NOT NULL,
	[Author]    NVARCHAR(255),
	[Year]      INT,
	[Title]     NVARCHAR(255),
	[EditionPublicationOrganization] NVARCHAR(255),
	[VolumPage] NVARCHAR(255),
	[Publisher] NVARCHAR(255),
	[City] NVARCHAR(255),
	[Location] NVARCHAR(255)
)
GO

GRANT EXECUTE ON TYPE::[dbo].[ReferenceTableType] TO [WMISUser]
GO