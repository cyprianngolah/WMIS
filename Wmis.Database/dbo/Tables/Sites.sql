CREATE TABLE [dbo].[Sites]
(
	[SiteId] INT   NOT NULL IDENTITY, 
    [SiteNumber] INT NULL, 
    [Name] NVARCHAR(50) NULL,
	CONSTRAINT [PK_Site] PRIMARY KEY CLUSTERED ([SiteId])
)
