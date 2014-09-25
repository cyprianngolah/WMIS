CREATE TABLE [dbo].[SpeciesSynonymTypes] (
    [SpeciesSynonymTypeId]  INT            NOT NULL IDENTITY,
	[Name]                  NVARCHAR (50)  NOT NULL,
    CONSTRAINT [PK_SpeciesSynonymTypes] PRIMARY KEY NONCLUSTERED ([SpeciesSynonymTypeId]),
	CONSTRAINT [UK_SpeciesSynonymTypes_Name] UNIQUE ([Name]),
)