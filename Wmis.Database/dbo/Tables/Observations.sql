﻿CREATE TABLE [dbo].[Observations]
(
	[ObservationId] INT IDENTITY(1,1) NOT NULL , 
    [ObservationUploadSurveyTemplateColumnMappingId] INT NOT NULL, 
	[RowIndex] INT NOT NULL, 
    [Value] NVARCHAR(255) NULL, 
    CONSTRAINT [PK_Observations] PRIMARY KEY ([ObservationId]), 
    CONSTRAINT [FK_Observations_ObservationUploadSurveyTemplateColumnMappings] FOREIGN KEY ([ObservationUploadSurveyTemplateColumnMappingId]) REFERENCES [ObservationUploadSurveyTemplateColumnMappings]([ObservationUploadSurveyTemplateColumnMappingId]) 
)
