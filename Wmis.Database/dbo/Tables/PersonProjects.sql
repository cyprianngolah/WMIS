CREATE TABLE [dbo].[PersonProjects]
(
	[PersonId]	INT NOT NULL, 
    [ProjectId]	INT NOT NULL, 
	CONSTRAINT [PK_PersonProjects] PRIMARY KEY CLUSTERED ([PersonId], [ProjectId]),
	CONSTRAINT [FK_PersonProjects_Person] FOREIGN KEY ([PersonId]) REFERENCES [dbo].[Person] ([PersonId]),
	CONSTRAINT [FK_PersonProjects_Projects] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Project] ([ProjectId]),
)