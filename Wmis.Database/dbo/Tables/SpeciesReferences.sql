CREATE TABLE [dbo].[SpeciesReferences]
(
	[SpeciesId]           INT NOT NULL,
	[ReferenceId]         INT NOT NULL,
	[ReferenceCategoryId] INT NOT NULL,
	CONSTRAINT [PK_SpeciesReferences] PRIMARY KEY CLUSTERED ([SpeciesId], [ReferenceId], [ReferenceCategoryId]),
    CONSTRAINT [FK_SpeciesReferences_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [dbo].[Species] ([SpeciesId]),
    CONSTRAINT [FK_SpeciesReferences_References] FOREIGN KEY ([ReferenceId]) REFERENCES [dbo].[References] ([ReferenceId]),
    CONSTRAINT [FK_SpeciesReferences_ReferenceCategories] FOREIGN KEY ([ReferenceCategoryId]) REFERENCES [dbo].[ReferenceCategories] ([ReferenceCategoryId]),
)