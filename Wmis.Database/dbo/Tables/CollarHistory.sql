CREATE TABLE [dbo].[CollarHistory]
(
	[CollarHistoryId]   INT             NOT NULL IDENTITY,
	[CollaredAnimalId]          INT             NOT NULL,
	[ActionTaken]            NVARCHAR (MAX)  NOT NULL,
	[Comment]           NVARCHAR (MAX)  NULL,
	[ChangeDate]        DATETIME        NOT NULL DEFAULT GETUTCDATE(),
	CONSTRAINT [PK_CollarHistory] PRIMARY KEY CLUSTERED ([CollarHistoryId]),
	CONSTRAINT [FK_CollarHistory_CollaredAnimals] FOREIGN KEY ([CollaredAnimalId]) REFERENCES [dbo].[CollaredAnimals] ([CollaredAnimalId])
)