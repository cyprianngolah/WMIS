CREATE TABLE [dbo].[TaxonomySynonyms](
	[TaxonomySynonymId] INT             NOT NULL IDENTITY,
	[TaxonomyId]        INT             NOT NULL,
	[Name]              NVARCHAR (50)   NOT NULL,
    CONSTRAINT [PK_TaxonomySynonyms] PRIMARY KEY CLUSTERED ([TaxonomySynonymId]),
	CONSTRAINT [UK_TaxonomySynonyms_Name] UNIQUE ([Name]),
    CONSTRAINT [FK_TaxonomySynonyms_Taxonomy] FOREIGN KEY ([TaxonomyId]) REFERENCES [dbo].[Taxonomy] ([TaxonomyId])
)