CREATE TABLE [dbo].[SpeciesEcozones]
(
	[SpeciesId] INT NOT NULL,
	[EcozoneId] INT NOT NULL,
	CONSTRAINT [PK_SpeciesEcozones] PRIMARY KEY CLUSTERED ([SpeciesId], [EcozoneId]),
    CONSTRAINT [FK_SpeciesEcozones_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [dbo].[Species] ([SpeciesId]),
    CONSTRAINT [FK_SpeciesEcozones_Ecozones] FOREIGN KEY ([EcozoneId]) REFERENCES [dbo].[Ecozones] ([EcozoneId])
)