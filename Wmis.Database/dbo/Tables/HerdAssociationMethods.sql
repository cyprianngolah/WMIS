CREATE TABLE [dbo].[HerdAssociationMethods]
(
	[HerdAssociationMethodId]	INT				NOT NULL IDENTITY, 
    [Name]						NVARCHAR(50)	NOT NULL, 
    CONSTRAINT [PK_HerdAssociationMethods] PRIMARY KEY CLUSTERED ([HerdAssociationMethodId]),
	CONSTRAINT [UK_HerdAssociationMethods] UNIQUE ([Name]),
)
