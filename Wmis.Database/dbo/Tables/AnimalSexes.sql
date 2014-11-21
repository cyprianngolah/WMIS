CREATE TABLE [dbo].[AnimalSexes]
(
	[AnimalSexId]		INT				NOT NULL IDENTITY, 
    [Name]				NVARCHAR(50)	NOT NULL, 
    CONSTRAINT [PK_AnimalSexes] PRIMARY KEY CLUSTERED ([AnimalSexId]),
	CONSTRAINT [UK_AnimalSexes] UNIQUE ([Name]),
)
