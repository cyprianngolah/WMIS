CREATE TABLE [dbo].[SurveyTemplateColumns]
(
	[SurveyTemplateColumnId] INT IDENTITY(1,1) NOT NULL, 
    [SurveyTemplateId] INT NOT NULL, 
    [SurveyTemplateColumnTypeId] INT NOT NULL, 
    [Name] NVARCHAR(50) NOT NULL, 
    [Order] INT NOT NULL, 
    [IsRequired] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_SurveyTemplateColumns] PRIMARY KEY ([SurveyTemplateColumnId]), 
    CONSTRAINT [FK_SurveyTemplateColumns_SurveyTemplate] FOREIGN KEY ([SurveyTemplateId]) REFERENCES [SurveyTemplate]([SurveyTemplateId]), 
    CONSTRAINT [FK_SurveyTemplateColumns_SurveyTemplateColumn] FOREIGN KEY ([SurveyTemplateColumnTypeId]) REFERENCES [SurveyTemplateColumnTypes]([SurveyTemplateColumnTypeId]) 
)
