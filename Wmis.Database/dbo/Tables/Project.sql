﻿CREATE TABLE [dbo].[Project]
(
	[ProjectId] INT NOT NULL IDENTITY , 
	[WildlifeResearchPermitId] INT NULL, 
    [Name] NVARCHAR(50) NOT NULL, 
    [LeadRegionId] INT NULL, 
    [ProjectStatusId] INT NULL, 
    [StatusDate] DATETIME NULL, 
    [ProjectLeadId] INT NULL, 
    [StartDate] DATETIME NULL, 
    [EndDate] DATETIME NULL, 
    [IsSensitiveData] BIT NULL, 
    [Description] NVARCHAR(MAX) NULL, 
    [Objectives] NVARCHAR(MAX) NULL, 
    [StudyArea] NVARCHAR(MAX) NULL, 
    [Methods] NVARCHAR(MAX) NULL, 
    [Comments] NVARCHAR(MAX) NULL, 
    [Results] NVARCHAR(MAX) NULL, 
    [LastUpdated] DATETIME NOT NULL, 
    CONSTRAINT [PK_Project] PRIMARY KEY ([ProjectId]), 
    CONSTRAINT [FK_Project_LeadRegion] FOREIGN KEY ([LeadRegionId]) REFERENCES dbo.[LeadRegion]([LeadRegionId]), 
    CONSTRAINT [FK_Project_ProjectStatus] FOREIGN KEY ([ProjectStatusId]) REFERENCES dbo.[ProjectStatus]([ProjectStatusId]), 
    CONSTRAINT [FK_Project_ProjectLead] FOREIGN KEY ([ProjectLeadId]) REFERENCES dbo.[Person]([PersonId])
)