CREATE TABLE [dbo].[ArgosPasses]
(
	[ArgosPassId]			INT         NOT NULL IDENTITY,
	[CollaredAnimalId]      INT         NOT NULL,
	[Latitude]				FLOAT       NOT NULL,
	[Longitude]				FLOAT       NOT NULL,
	[LocationDate]			DATETIME    NOT NULL,
	[ArgosPassStatusId]		INT			NULL,
	[LocationClass]			NVARCHAR(50) NULL,
	[Comment] NVARCHAR(MAX) NULL, 
    CONSTRAINT [PK_ArgosPasses] PRIMARY KEY CLUSTERED ([ArgosPassId]),
	CONSTRAINT [FK_ArgosPasses_CollaredAnimals] FOREIGN KEY ([CollaredAnimalId]) REFERENCES [dbo].[CollaredAnimals] ([CollaredAnimalId]),
	CONSTRAINT [FK_ArgosPasses_ArgosPassStatuses] FOREIGN KEY ([ArgosPassStatusId]) REFERENCES [dbo].[ArgosPassStatuses] ([ArgosPassStatusId])
)