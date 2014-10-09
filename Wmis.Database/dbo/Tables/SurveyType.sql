CREATE TABLE [dbo].[SurveyType]
(
	[SurveyTypeId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NULL, 
    CONSTRAINT [PK_SurveyType] PRIMARY KEY ([SurveyTypeId])
)
