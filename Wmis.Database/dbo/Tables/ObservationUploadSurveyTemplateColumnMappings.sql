CREATE TABLE [dbo].[ObservationUploadSurveyTemplateColumnMappings]
(
	[ObservationUploadSurveyTemplateColumnMappingId] INT IDENTITY(1,1) NOT NULL, 
    [ObservationUploadId] INT NOT NULL, 
    [SurveyTemplateColumnId] INT NOT NULL, 
    [ColumnIndex] INT NOT NULL, 
    CONSTRAINT [PK_ObservationUploadSurveyTemplateColumnMapping] PRIMARY KEY ([ObservationUploadSurveyTemplateColumnMappingId]), 
    CONSTRAINT [FK_ObservationUploadSurveyTemplateColumnMapping_ObservationUpload] FOREIGN KEY ([ObservationUploadId]) REFERENCES [ObservationUploads]([ObservationUploadId]), 
    CONSTRAINT [FK_ObservationUploadSurveyTemplateColumnMapping_SurveyTemplateColumnId] FOREIGN KEY ([SurveyTemplateColumnId]) REFERENCES [SurveyTemplateColumns]([SurveyTemplateColumnId]) 
)
