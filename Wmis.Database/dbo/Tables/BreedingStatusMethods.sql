CREATE TABLE [dbo].[BreedingStatusMethods]
(
	[BreedingStatusMethodId]	INT				NOT NULL IDENTITY, 
    [Name]						NVARCHAR(50)	NOT NULL, 
    CONSTRAINT [PK_BreedingStatusMethods] PRIMARY KEY CLUSTERED ([BreedingStatusMethodId]),
	CONSTRAINT [UK_BreedingStatusMethods] UNIQUE ([Name]),
)
