CREATE TABLE [dbo].[ObservationRows]
(
	[ObservationRowId] INT IDENTITY (1,1) NOT NULL, 
    [ObservationUploadId] INT NOT NULL, 
    [RowIndex] INT NOT NULL, 
    [Latitude] DECIMAL(9, 6) NULL, 
    [Longitude] DECIMAL(9, 6) NULL, 
    [Timestamp] DATETIME NULL, 
    [ObservationRowStatusId] INT NULL, 
    [Comment] NVARCHAR(MAX) NULL, 
    CONSTRAINT [PK_ObservationRows] PRIMARY KEY ([ObservationRowId]), 
    CONSTRAINT [FK_ObservationRows_ObservationUploads] FOREIGN KEY ([ObservationUploadId]) REFERENCES [ObservationUploads]([ObservationUploadId]) ON DELETE CASCADE,
    CONSTRAINT [FK_ObservationRows_ArgosPassStatuses] FOREIGN KEY ([ObservationRowStatusId]) REFERENCES [ArgosPassStatuses]([ArgosPassStatusId])
)
