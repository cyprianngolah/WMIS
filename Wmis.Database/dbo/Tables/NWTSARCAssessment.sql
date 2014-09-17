CREATE TABLE [dbo].[NwtSarcAssessments]
(
	[NwtSarcAssessmentId] INT             NOT NULL IDENTITY,
	[Name]            NVARCHAR (50)   NOT NULL,
	CONSTRAINT [PK_NwtSarcAssessments] PRIMARY KEY CLUSTERED ([NwtSarcAssessmentId]),
	CONSTRAINT [UK_NwtSarcAssessments_Name] UNIQUE ([Name]),
)