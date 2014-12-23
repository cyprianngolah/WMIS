CREATE TABLE [dbo].[ObservationUploadStatuses]
(
	[ObservationUploadStatusId] INT NOT NULL,
	[Name] NVARCHAR(50) NOT NULL, 
    [fkNextObservationUploadStatusId] INT NULL, 
    CONSTRAINT [PK_ObservationUploadStatuses] PRIMARY KEY CLUSTERED ([ObservationUploadStatusId])
)
