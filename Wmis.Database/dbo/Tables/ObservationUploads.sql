CREATE TABLE [dbo].[ObservationUploads]
(
	[ObservationUploadId] INT IDENTITY(1,1) NOT NULL,
	[SurveyId] INT NOT NULL,
	[ObservationUploadStatusId] INT NOT NULL, 
	[OriginalFileName] NVARCHAR(255) NOT NULL, 
	[FilePath] NVARCHAR(255) NOT NULL, 
    [HeaderRowIndex] INT NULL, 
    [FirstDataRowIndex] INT NULL, 
	[UploadedTimestamp] DATETIME NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_ObservationUploads] PRIMARY KEY CLUSTERED ([ObservationUploadId]), 
    CONSTRAINT [FK_ObservationUploads_Surveys] FOREIGN KEY ([SurveyId]) REFERENCES [Survey]([SurveyId]),
	CONSTRAINT [FK_ObservationUploads_ObservationUploadStatuses] FOREIGN KEY ([ObservationUploadStatusId]) REFERENCES [ObservationUploadStatuses]([ObservationUploadStatusId])
	
)
