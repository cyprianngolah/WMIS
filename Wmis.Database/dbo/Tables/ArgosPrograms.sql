CREATE TABLE [dbo].[ArgosPrograms]
(
	[ArgosProgramId]	INT NOT NULL IDENTITY, 
	[ArgosUserId]		INT NOT NULL, 
    [ProgramNumber]		NVARCHAR(50) NOT NULL,
    CONSTRAINT [PK_ArgosPrograms] PRIMARY KEY ([ArgosProgramId]),
	CONSTRAINT [FK_ArgosPrograms_ArgosUsers] FOREIGN KEY ([ArgosUserId]) REFERENCES [dbo].[ArgosUsers] ([ArgosUserId]),
)
