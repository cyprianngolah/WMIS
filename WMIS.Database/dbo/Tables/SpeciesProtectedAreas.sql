CREATE TABLE [dbo].[SpeciesProtectedAreas]
(
	[SpeciesId]       INT NOT NULL,
	[ProtectedAreaId] INT NOT NULL,
	CONSTRAINT [PK_SpeciesProtectedAreas] PRIMARY KEY CLUSTERED ([SpeciesId], [ProtectedAreaId]),
    CONSTRAINT [FK_SpeciesProtectedAreas_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [dbo].[Species] ([SpeciesId]),
    CONSTRAINT [FK_SpeciesProtectedAreas_ProtectedAreas] FOREIGN KEY ([ProtectedAreaId]) REFERENCES [dbo].[ProtectedAreas] ([ProtectedAreaId])
)