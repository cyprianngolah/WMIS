CREATE TABLE [dbo].[HerdPopulations]
(
	[HerdPopulationId]	INT				NOT NULL IDENTITY, 
    [Name]				NVARCHAR(50)	NOT NULL, 
    CONSTRAINT [PK_HerdPopulations] PRIMARY KEY CLUSTERED ([HerdPopulationId]),
	CONSTRAINT [UK_HerdPopulations] UNIQUE ([Name]),
)
