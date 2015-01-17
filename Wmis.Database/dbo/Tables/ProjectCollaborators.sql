CREATE TABLE [dbo].[ProjectCollaborators]
(
	[ProjectId] INT NOT NULL,
	[CollaboratorId] INT NOT NULL,
	CONSTRAINT [PK_ProjectCollaborators] PRIMARY KEY CLUSTERED ([ProjectId], [CollaboratorId]),
    CONSTRAINT [FK_ProjectCollaborators_Projects] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Project] ([ProjectId]),
    CONSTRAINT [FK_ProjectCollaborators_Collaborators] FOREIGN KEY ([CollaboratorId]) REFERENCES [dbo].[Collaborators] ([CollaboratorId])
)