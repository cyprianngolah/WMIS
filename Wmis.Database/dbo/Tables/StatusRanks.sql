CREATE TABLE [dbo].[StatusRanks]
(
	[StatusRankId] INT             NOT NULL IDENTITY,
	[Name]         NVARCHAR (50)   NOT NULL,
	CONSTRAINT [PK_StatusRanks] PRIMARY KEY CLUSTERED ([StatusRankId]),
	CONSTRAINT [UK_StatusRanks_Name] UNIQUE ([Name]),
)