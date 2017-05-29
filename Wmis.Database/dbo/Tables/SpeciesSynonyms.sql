CREATE TABLE [dbo].[SpeciesSynonyms] (
    [SpeciesSynonymId]        INT             NOT NULL IDENTITY,
	[SpeciesSynonymTypeId]    INT             NOT NULL,
	[SpeciesId]               INT             NOT NULL,
	[Name]                    VARCHAR(200)   NULL,
    CONSTRAINT [PK_SpeciesSynonyms] PRIMARY KEY CLUSTERED ([SpeciesSynonymId]),
    CONSTRAINT [UK_SpeciesSynonyms_SpeciesSynonymTypeId_SpeciesId_Name] UNIQUE ([SpeciesSynonymTypeId], [SpeciesId], [Name]),
    CONSTRAINT [FK_SpeciesSynonyms_SpeciesSynonymTypeId] FOREIGN KEY ([SpeciesSynonymTypeId]) REFERENCES [dbo].[SpeciesSynonymTypes] ([SpeciesSynonymTypeId]),
    CONSTRAINT [FK_SpeciesSynonyms_SpeciesId] FOREIGN KEY ([SpeciesId]) REFERENCES [dbo].[Species] ([SpeciesId])
)