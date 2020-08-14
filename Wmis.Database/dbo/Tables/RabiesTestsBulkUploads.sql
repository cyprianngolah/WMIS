CREATE TABLE [dbo].[RabiesTestsBulkUploads](
	[BulkUploadId] [int] IDENTITY(1,1) NOT NULL,
	[UploadType] [nvarchar](50) NOT NULL,
	[OriginalFileName] [nvarchar](255) NOT NULL,
	[FilePath] [nvarchar](255) NOT NULL,
	[FileName] [nvarchar](255) NOT NULL,
	[IsSuccessful] [bit] NOT NULL,
	[CreatedAt] [datetime] NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[RabiesTestsBulkUploads] ADD  DEFAULT ('RabiesTests') FOR [UploadType]
GO

ALTER TABLE [dbo].[RabiesTestsBulkUploads] ADD  DEFAULT ((1)) FOR [IsSuccessful]
GO

ALTER TABLE [dbo].[RabiesTestsBulkUploads] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
