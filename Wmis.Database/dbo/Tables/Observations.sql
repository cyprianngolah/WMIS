CREATE TABLE [dbo].[Observations]
(
	[ObservationId] INT IDENTITY(1,1) NOT NULL, 
	[ObservationRowId] INT NOT NULL, 
    [ObservationUploadSurveyTemplateColumnMappingId] INT NOT NULL, 
    [Value] NVARCHAR(MAX) NULL, 
    CONSTRAINT [PK_Observations] PRIMARY KEY ([ObservationId]), 
    CONSTRAINT [FK_Observations_ObservationUploadSurveyTemplateColumnMappings] FOREIGN KEY ([ObservationUploadSurveyTemplateColumnMappingId]) REFERENCES [ObservationUploadSurveyTemplateColumnMappings]([ObservationUploadSurveyTemplateColumnMappingId]),
	CONSTRAINT [FK_Observations_ObservationRows] FOREIGN KEY ([ObservationRowId]) REFERENCES [ObservationRows]([ObservationRowId]) 
)
