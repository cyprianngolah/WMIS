CREATE TABLE [dbo].[HistoryLogs]
(
	[HistoryLogId]		INT             NOT NULL IDENTITY,
	[CollaredAnimalId]  INT             NULL,
	[SpeciesId]		INT             NULL,
	[Item]				NVARCHAR (MAX)  NOT NULL,
	[Value]				NVARCHAR (MAX)  NOT NULL,
	[ChangeBy]			NVARCHAR (50)  NOT NULL,
	[ChangeDate]        DATETIME        NOT NULL DEFAULT GETUTCDATE(),
	[Comment]           NVARCHAR (MAX)  NULL,
	[ProjectId] INT NULL, 
	[SurveyId] INT NULL,
    CONSTRAINT [PK_HistoryLogs] PRIMARY KEY CLUSTERED ([HistoryLogId]),
	CONSTRAINT [FK_HistoryLogs_CollaredAnimals] FOREIGN KEY ([CollaredAnimalId]) REFERENCES [dbo].[CollaredAnimals] ([CollaredAnimalId]),
	CONSTRAINT [FK_HistoryLogs_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [dbo].[Species] ([SpeciesId]),
	CONSTRAINT [CK_HistoryLogs_ForeignKeys] CHECK(
		(case when CollaredAnimalId IS NOT NULL then 1 else 0 end + 
		case when SpeciesId IS NOT NULL then 1 else 0 end +
		case when SurveyId IS NOT NULL then 1 else 0 end +
		case when ProjectId IS NOT NULL then 1 else 0 end) = 1
	)
)