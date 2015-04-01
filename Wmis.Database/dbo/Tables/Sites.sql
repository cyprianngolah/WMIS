CREATE TABLE [dbo].[Sites]
(
	[SiteId] INT   NOT NULL IDENTITY, 
    [SiteNumber] NVARCHAR(50) NULL, 
    [Name] NVARCHAR(50) NULL,
	[ProjectId] INT NOT NULL, 
    CONSTRAINT [PK_Site] PRIMARY KEY CLUSTERED ([SiteId]),
    CONSTRAINT [FK_Sites_Project] FOREIGN KEY ([ProjectId]) REFERENCES dbo.[Project]([ProjectId]) 
)
