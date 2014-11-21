CREATE TABLE [dbo].[ConfidenceLevels]
(
	[ConfidenceLevelId]		INT				NOT NULL IDENTITY, 
    [Name]					NVARCHAR(50)	NOT NULL, 
    CONSTRAINT [PK_ConfidenceLevels] PRIMARY KEY CLUSTERED ([ConfidenceLevelId]),
	CONSTRAINT [UK_ConfidenceLevels] UNIQUE ([Name]),
)
