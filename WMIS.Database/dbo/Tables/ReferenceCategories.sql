CREATE TABLE [dbo].[ReferenceCategories]
(
	[ReferenceCategoryId] INT             NOT NULL IDENTITY,
	[Name]                NVARCHAR (50)   NOT NULL,
	CONSTRAINT [PK_ReferenceCategories] PRIMARY KEY CLUSTERED ([ReferenceCategoryId]),
	CONSTRAINT [UK_ReferenceCategories_Name] UNIQUE ([Name]),
)
