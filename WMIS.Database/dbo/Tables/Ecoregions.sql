CREATE TABLE [dbo].[Ecoregions]
(
	[EcoregionId] INT             NOT NULL IDENTITY,
	[Name]            NVARCHAR (50)   NOT NULL,
	CONSTRAINT [PK_Ecoregions] PRIMARY KEY CLUSTERED ([EcoregionId]),
	CONSTRAINT [UK_Ecoregions_Name] UNIQUE ([Name]),
)