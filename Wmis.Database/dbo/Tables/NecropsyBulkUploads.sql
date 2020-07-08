CREATE TABLE [dbo].[NecropsyBulkUploads](
	[BulkUploadId] [int] IDENTITY(1,1) NOT NULL,
	[UploadType] [nvarchar](50) NOT NULL,
	[OriginalFileName] [nvarchar](255) NOT NULL,
	[FilePath] [nvarchar](255) NOT NULL,
	[FileName] [nvarchar](255) NOT NULL,
	[IsSuccessful] [bit] NOT NULL,
	[CreatedAt] [datetime] NULL
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[NecropsyBulkUploads] ADD  DEFAULT ('necropsy') FOR [UploadType]
GO

ALTER TABLE [dbo].[NecropsyBulkUploads] ADD  DEFAULT ((1)) FOR [IsSuccessful]
GO

ALTER TABLE [dbo].[NecropsyBulkUploads] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO

