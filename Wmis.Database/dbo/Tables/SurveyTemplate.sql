CREATE TABLE [dbo].[SurveyTemplate]
(
	[SurveyTemplateId]		INT NOT NULL IDENTITY, 
    [Name] NVARCHAR(50)		NOT NULL, 
	[DateCreated]		    DATETIME NOT NULL DEFAULT GETUTCDATE(),
	[CreatedBy]				VARCHAR(50) NOT NULL DEFAULT "Unknown",
    CONSTRAINT [PK_SurveyTemplate] PRIMARY KEY ([SurveyTemplateId])
)
