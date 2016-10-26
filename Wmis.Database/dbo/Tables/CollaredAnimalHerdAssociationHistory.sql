CREATE TABLE [dbo].[CollaredAnimalHerdAssociationHistory]
(
	[CollaredAnimalHerdId] INT NOT NULL IDENTITY,
	[HerdPopulationId] INT NULL, 
    [HerdAssociationConfidenceLevelId] INT NULL, 
    [HerdAssociationMethodId] INT NULL, 
    [HerdAssociationDate] DATETIME NULL, 
    [UserId] NVARCHAR(50) NULL, 
    [CollaredAnimalId] INT NULL, 
    CONSTRAINT [PK_CollaredHerdId] PRIMARY KEY CLUSTERED ([CollaredAnimalHerdId]),
	CONSTRAINT [FK_CollaredAnimalHerdHistory_ConfidenceLevels_HerdAssociation] FOREIGN KEY ([HerdAssociationConfidenceLevelId]) REFERENCES [dbo].[ConfidenceLevels] ([ConfidenceLevelId]),
	CONSTRAINT [FK_CollaredAnimalHerdHistory_HerdPopulations] FOREIGN KEY ([HerdPopulationId]) REFERENCES [dbo].[HerdPopulations] ([HerdPopulationId]),
	CONSTRAINT [FK_CollaredAnimalHerdHistory_HerdAssociationMethods] FOREIGN KEY ([HerdAssociationMethodId]) REFERENCES [dbo].[HerdAssociationMethods] ([HerdAssociationMethodId]),
	CONSTRAINT [FK_CollaredAnimalHerdHistory_CollaredAnimals] FOREIGN KEY([CollaredAnimalId])REFERENCES [dbo].[CollaredAnimals] ([CollaredAnimalId]),
)
