CREATE TYPE [dbo].[BulkSpeciesUploadTableType] AS TABLE(
	[Group] [varchar](200) NULL,
	[Kingdom] [varchar](200) NULL,
	[Phylum] [varchar](200) NULL,
	[Class] [varchar](200) NULL,
	[Order] [varchar](200) NULL,
	[Family] [varchar](200) NULL,
	[Name] [varchar](200) NULL,
	[CommonName] [varchar](200) NULL,
	[ELCode] [varchar](200) NULL,
	[RangeExtentScore] [varchar](200) NULL,
	[RangeExtentDescription] [varchar](max) NULL,
	[NumberOfOccurencesScore] [varchar](200) NULL,
	[NumberOfOccurencesDescription] [varchar](max) NULL,
	[StatusRankId] [int] NULL,
	[StatusRankDescription] [varchar](max) NULL,
	[SRank] [varchar](200) NULL,
	[DecisionProcessDescription] [varchar](max) NULL
)
GO
