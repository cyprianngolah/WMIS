CREATE TABLE [dbo].[SurveyTemplate]
(
	[SurveyTemplateId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_SurveyTemplate] PRIMARY KEY ([SurveyTemplateId])
)
