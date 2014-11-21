CREATE TABLE [dbo].[BreedingStatuses]
(
	[BreedingStatusId]	INT				NOT NULL IDENTITY, 
    [Name]				NVARCHAR(50)	NOT NULL, 
    CONSTRAINT [PK_BreedingStatuses] PRIMARY KEY CLUSTERED ([BreedingStatusId]),
	CONSTRAINT [UK_BreedingStatuses] UNIQUE ([Name]),
)
