﻿CREATE TABLE [dbo].[Survey]
(
	[SurveyId] INT NOT NULL IDENTITY, 
	[ProjectId] INT NOT NULL,
    [TargetSpeciesId] INT NULL, 
	[SurveyTypeId] INT NULL, 
    [SurveyTemplateId] INT NULL, 
    [Description] NVARCHAR(MAX) NULL, 
    [Method] NVARCHAR(MAX) NULL, 
    [Results] NVARCHAR(MAX) NULL, 
    [AircraftType] NVARCHAR(MAX) NULL, 
    [AircraftCallsign] NVARCHAR(MAX) NULL, 
    [Pilot] NVARCHAR(MAX) NULL, 
    [LeadSurveyor] NVARCHAR(MAX) NULL, 
    [SurveyCrew] NVARCHAR(MAX) NULL, 
    [ObserverExpertise] NVARCHAR(MAX) NULL, 
    [AircraftCrewResults] NVARCHAR(MAX) NULL, 
    [CloudCover] NVARCHAR(MAX) NULL, 
    [LightConditions] NVARCHAR(MAX) NULL, 
    [SnowCover] NVARCHAR(MAX) NULL, 
    [Temperature] NVARCHAR(MAX) NULL, 
    [Precipitation] NVARCHAR(MAX) NULL, 
    [WindSpeed] NVARCHAR(MAX) NULL, 
	[WindDirection] NVARCHAR(MAX) NULL, 
    [WeatherComments] NVARCHAR(MAX) NULL, 
    [StartDate] DATE NULL, 
    [LastUpdated] DATETIME NOT NULL, 
    CONSTRAINT [PK_Survey] PRIMARY KEY ([SurveyId]), 
	CONSTRAINT [FK_Survey_Project] FOREIGN KEY ([ProjectId]) REFERENCES [Project]([ProjectId]), 
    CONSTRAINT [FK_Survey_Species] FOREIGN KEY ([TargetSpeciesId]) REFERENCES [Species]([SpeciesId]), 
    CONSTRAINT [FK_Survey_SurveyType] FOREIGN KEY ([SurveyTypeId]) REFERENCES [SurveyType]([SurveyTypeId]), 
    CONSTRAINT [FK_Survey_SurveyTemplate] FOREIGN KEY ([SurveyTemplateId]) REFERENCES [SurveyTemplate]([SurveyTemplateId]) 
)
