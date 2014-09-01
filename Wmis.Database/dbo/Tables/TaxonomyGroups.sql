CREATE TABLE [dbo].[TaxonomyGroups] (
    [TaxonomyGroupId]  INT            NOT NULL IDENTITY,
	[Name]             NVARCHAR (50)   NOT NULL,
    CONSTRAINT [PK_TaxonomyGroups] PRIMARY KEY NONCLUSTERED ([TaxonomyGroupId]),
	CONSTRAINT [UK_TaxonomyGroups_Name] UNIQUE ([Name]),
)