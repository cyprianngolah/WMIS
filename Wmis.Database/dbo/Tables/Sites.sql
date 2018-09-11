CREATE TABLE [dbo].[Sites]
(
	[SiteId] INT   NOT NULL IDENTITY, 
    [SiteNumber] NVARCHAR(50) NULL, 
    [Name] NVARCHAR(50) NULL,
	[Latitude] DECIMAL(9, 6) NULL, 
    [Longitude] DECIMAL(9, 6) NULL, 
    [ProjectId] INT NOT NULL,
	[DateEstablished] DATE NULL,
	[Comments] NVARCHAR (max) NULL,
	[Reliability] NVARCHAR(50) NULL,
	[Map] NVARCHAR(50) NULL,
	[NearestCommunity] NVARCHAR(80) NULL,
	[Aspect] NVARCHAR(50) NULL,
	[CliffHeight] NVARCHAR(25) NULL,
	[NestHeight] NVARCHAR(25) NULL,
	[NestType] NVARCHAR(25) NULL,
	[InitialObserver] NVARCHAR(80) NULL,
	[Reference] NVARCHAR(250) NULL,
	[Habitat] NVARCHAR(80) NULL,
    CONSTRAINT [PK_Site] PRIMARY KEY CLUSTERED ([SiteId]), 
    CONSTRAINT [FK_Sites_Project] FOREIGN KEY ([ProjectId]) REFERENCES [Project]([ProjectId])
)
