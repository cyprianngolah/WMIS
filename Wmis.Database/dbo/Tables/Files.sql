CREATE TABLE [dbo].[Files] (
    [FileId] INT NOT NULL IDENTITY,
    [CollaredAnimalId] INT NULL,
    [ProjectId] INT NULL,
    [SpeciesId] INT NULL,
	[SurveyId] INT NULL,
	[Name] NVARCHAR (50) NOT NULL,
	[Path] NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_Files] PRIMARY KEY NONCLUSTERED ([FileId]),
	CONSTRAINT [FK_Files_CollaredAnimals] FOREIGN KEY ([CollaredAnimalId]) REFERENCES dbo.[CollaredAnimals]([CollaredAnimalId]), 
	CONSTRAINT [FK_Files_Projects] FOREIGN KEY ([ProjectId]) REFERENCES dbo.[Project]([ProjectId]), 
	CONSTRAINT [FK_Files_Species] FOREIGN KEY ([SpeciesId]) REFERENCES dbo.[Species]([SpeciesId]), 
	CONSTRAINT [FK_Files_Survey] FOREIGN KEY ([SurveyId]) REFERENCES dbo.[Survey]([SurveyId]), 
	CONSTRAINT [CK_Files_ForeignKeys] CHECK(
		(case when CollaredAnimalId IS NOT NULL then 1 else 0 end + 
		case when ProjectId IS NOT NULL then 1 else 0 end + 
		case when SpeciesId IS NOT NULL then 1 else 0 end +
		case when SurveyId IS NOT NULL then 1 else 0 end) = 1
	)
)