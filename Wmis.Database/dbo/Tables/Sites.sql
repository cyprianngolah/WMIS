CREATE TABLE [dbo].[Sites]
(
	[SiteId] INT   NOT NULL IDENTITY, 
    [SiteNumber] NVARCHAR(50) NULL, 
    [Name] NVARCHAR(50) NULL,
	[Latitude] DECIMAL(9, 6) NULL, 
    [Longitude] DECIMAL(9, 6) NULL, 
    CONSTRAINT [PK_Site] PRIMARY KEY CLUSTERED ([SiteId])
)
