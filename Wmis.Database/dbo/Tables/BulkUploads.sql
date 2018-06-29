CREATE TABLE [dbo].[BulkUploads](
	[BulkUploadId] [int] IDENTITY(1,1) NOT NULL,
	[UploadType] [nvarchar](50) NOT NULL DEFAULT ('species'),
	[OriginalFileName] [nvarchar](255) NOT NULL,
	[FilePath] [nvarchar](255) NOT NULL,
	[FileName] [nvarchar](255) NOT NULL,
	[IsSuccessful] [bit] NOT NULL DEFAULT ((1)),
	[CreatedAt] [datetime] NULL DEFAULT (getutcdate())
) ON [PRIMARY]