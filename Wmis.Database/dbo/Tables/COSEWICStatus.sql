CREATE TABLE [dbo].[COSEWICStatus]
(
	[COSEWICStatusId] INT             NOT NULL IDENTITY,
	[Name]            NVARCHAR (50)   NOT NULL,
	CONSTRAINT [PK_COSEWICStatus] PRIMARY KEY CLUSTERED ([COSEWICStatusId]),
	CONSTRAINT [UK_COSEWICStatus_Name] UNIQUE ([Name])
)
