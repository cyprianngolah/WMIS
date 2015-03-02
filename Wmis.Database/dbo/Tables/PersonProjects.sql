CREATE TABLE [dbo].[PersonProjects]
(
	[PersonProjectId] INT NOT NULL IDENTITY,
	[PersonId]	INT NOT NULL, 
    [ProjectId]	INT NOT NULL, 
	CONSTRAINT [PK_PersonProjects] PRIMARY KEY ([PersonProjectId]),
	CONSTRAINT [FK_PersonProjects_Person] FOREIGN KEY ([PersonId]) REFERENCES [dbo].[Person] ([PersonId]),
	CONSTRAINT [FK_PersonProjects_Projects] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Project] ([ProjectId]),
)