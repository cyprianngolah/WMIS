CREATE TABLE [dbo].[Taxonomy] (
    [TaxonomyId]        INT             NOT NULL IDENTITY,
	[TaxonomyGroupId]   INT             NOT NULL,
	[Name]              NVARCHAR (50)   NOT NULL,
    CONSTRAINT [PK_Taxonomy] PRIMARY KEY CLUSTERED ([TaxonomyId]),
    CONSTRAINT [UK_Taxonomy_Name] UNIQUE ([Name]),
    CONSTRAINT [FK_Taxonomy_TaxonomyGroups] FOREIGN KEY ([TaxonomyGroupId]) REFERENCES [dbo].[TaxonomyGroups] ([TaxonomyGroupId])
)