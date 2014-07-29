CREATE TABLE [dbo].[SpeciesEcoregions]
(
	[SpeciesId] INT NOT NULL,
	[EcoregionId] INT NOT NULL,
	CONSTRAINT [PK_SpeciesEcoregions] PRIMARY KEY CLUSTERED ([SpeciesId], [EcoregionId]),
    CONSTRAINT [FK_SpeciesEcoregions_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [dbo].[Species] ([SpeciesId]),
    CONSTRAINT [FK_SpeciesEcoregions_Ecoregions] FOREIGN KEY ([EcoregionId]) REFERENCES [dbo].[Ecoregions] ([EcoregionId])
)