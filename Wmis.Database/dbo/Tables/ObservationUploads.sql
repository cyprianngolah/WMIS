CREATE TABLE [dbo].[ObservationUploads]
(
	[ObservationUploadId] INT IDENTITY NOT NULL,
	[fkProjectId] INT NOT NULL,
	[fkObservationUploadStatusId] INT NOT NULL, 
	[OriginalFileName] NVARCHAR(255) NOT NULL, 
	[FilePath] NVARCHAR(255) NOT NULL, 
    [HeaderRowIndex] INT NULL, 
    [FirstDataRowIndex] INT NULL, 
	[UploadedTimestamp] DATETIME NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_ObservationUploads] PRIMARY KEY CLUSTERED ([ObservationUploadId])
)
