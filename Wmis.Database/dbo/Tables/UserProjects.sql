CREATE TABLE [dbo].[UserProjects]
(
	[UserId]	INT NOT NULL, 
    [ProjectId]	INT NOT NULL, 
	CONSTRAINT [PK_UserProjects] PRIMARY KEY CLUSTERED ([UserId], [ProjectId]),
	CONSTRAINT [FK_UserProjects_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([UserId]),
	CONSTRAINT [FK_UserProjects_Projects] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Project] ([ProjectId]),
)
