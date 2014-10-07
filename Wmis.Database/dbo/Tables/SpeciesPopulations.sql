CREATE TABLE [dbo].[SpeciesPopulations]
(
	[SpeciesPopulationId]	INT NOT NULL IDENTITY,
	[SpeciesId]				INT NOT NULL,
	[Name]					NVARCHAR (50) NOT NULL,
	CONSTRAINT [PK_SpeciesPopulations] PRIMARY KEY NONCLUSTERED ([SpeciesPopulationId]),
	CONSTRAINT [UK_SpeciesPopulations_SpeciesId_Name] UNIQUE ([SpeciesId], [Name]),
    CONSTRAINT [FK_SpeciesPopulations_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [dbo].[Species] ([SpeciesId])
)