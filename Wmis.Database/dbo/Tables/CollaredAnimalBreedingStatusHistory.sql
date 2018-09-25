CREATE TABLE [dbo].[CollaredAnimalBreedingStatusHistory]
(
	[CollaredAnimalBreedingStatusHistoryId] [int] IDENTITY(1,1) NOT NULL,
	[BreedingStatusId] [int] NULL,
	[BreedingStatusConfidenceLevelId] [int] NULL,
	[BreedingStatusMethodId] [int] NULL,
	[BreedingStatusEffectiveDate] [datetime] NULL,
	[UserId] [nvarchar](50) NULL,
	[CollaredAnimalId] [int] NULL,
    CONSTRAINT [PK_CollaredBreedingStatusId] PRIMARY KEY CLUSTERED ([CollaredAnimalBreedingStatusHistoryId]),
	CONSTRAINT [FK_CollaredAnimalBreedingHistory_ConfidenceLevels_BreedingStatus] FOREIGN KEY ([BreedingStatusConfidenceLevelId]) REFERENCES [dbo].[ConfidenceLevels] ([ConfidenceLevelId]),
	CONSTRAINT [FK_CollaredAnimalBreedingHistory_BreedingStatuses] FOREIGN KEY ([BreedingStatusId]) REFERENCES [dbo].[BreedingStatuses] ([BreedingStatusId]),
	CONSTRAINT [FK_CollaredAnimalBreedingHistory_BreedingStatusMethods] FOREIGN KEY ([BreedingStatusMethodId]) REFERENCES [dbo].[BreedingStatusMethods] ([BreedingStatusMethodId]),
	CONSTRAINT [FK_CollaredAnimalBreedingHistory_CollaredAnimals] FOREIGN KEY([CollaredAnimalId])REFERENCES [dbo].[CollaredAnimals] ([CollaredAnimalId]),
)
