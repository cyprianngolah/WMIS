CREATE TABLE [dbo].[CollarHistory]
(
	[CollarHistoryId]   INT             NOT NULL IDENTITY,
	[CollaredAnimalId]  INT             NOT NULL,
	[Item]				NVARCHAR (MAX)  NOT NULL,
	[Value]				NVARCHAR (MAX)  NOT NULL,
	[ChangeBy]			NVARCHAR (50)  NOT NULL,
	[ChangeDate]        DATETIME        NOT NULL DEFAULT GETUTCDATE(),
	[Comment]           NVARCHAR (MAX)  NULL,
	CONSTRAINT [PK_CollarHistory] PRIMARY KEY CLUSTERED ([CollarHistoryId]),
	CONSTRAINT [FK_CollarHistory_CollaredAnimals] FOREIGN KEY ([CollaredAnimalId]) REFERENCES [dbo].[CollaredAnimals] ([CollaredAnimalId])
)