CREATE TABLE [dbo].[CollarRegions]
(
	[CollarRegionId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_CollarRegions] PRIMARY KEY ([CollarRegionId]),
	CONSTRAINT [UK_CollarRegions_Name] UNIQUE ([Name])
)
