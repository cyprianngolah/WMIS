CREATE TABLE [dbo].[ArgosPasses]
(
	[ArgosPassId]   INT         NOT NULL IDENTITY,
	[CollaredAnimalId]      INT         NOT NULL,
	[Latitude]      FLOAT       NOT NULL,
	[Longitude]     FLOAT       NOT NULL,
	[LocationDate]  DATETIME    NOT NULL,
	CONSTRAINT [PK_ArgosPasses] PRIMARY KEY CLUSTERED ([ArgosPassId]),
	CONSTRAINT [FK_ArgosPasses_CollaredAnimals] FOREIGN KEY ([CollaredAnimalId]) REFERENCES [dbo].[CollaredAnimals] ([CollaredAnimalId])
)