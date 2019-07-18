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
	[RangeExtentDescription] [varchar](1000) NULL,
	[NumberOfOccurencesScore] [varchar](200) NULL,
	[NumberOfOccurencesDescription] [varchar](1000) NULL,
	[StatusRankId] [int] NULL,
	[StatusRankDescription] [varchar](1000) NULL,
	[SRank] [varchar](200) NULL,
	[DecisionProcessDescription] [varchar](1000) NULL
)
GO
