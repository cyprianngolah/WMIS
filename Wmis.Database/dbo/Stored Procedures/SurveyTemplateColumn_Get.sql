CREATE PROCEDURE [dbo].[SurveyTemplateColumn_Get]
	@p_observationUploadId int
AS
	
	SELECT
		stc.SurveyTemplateColumnId as [Key]
		, stc.SurveyTemplateId as SurveyTemplateKey
		, stc.Name
		, stc.[Order]
		, stct.SurveyTemplateColumnTypeId as [Key]
		, stct.Name
	FROM	
		dbo.ObservationUploads ou 
			INNER JOIN dbo.Project p on ou.ProjectId = p.ProjectId
			INNER JOIN dbo.Survey s on p.ProjectId = s.ProjectId
			INNER JOIN dbo.SurveyTemplate st on s.SurveyTemplateId = st.SurveyTemplateId
			INNER JOIN dbo.SurveyTemplateColumns stc on st.SurveyTemplateId = stc.SurveyTemplateId
			INNER JOIN dbo.SurveyTemplateColumnTypes stct on stc.SurveyTemplateColumnTypeId = stct.SurveyTemplateColumnTypeId
	WHERE
		ou.ObservationUploadId = @p_observationUploadId
	ORDER BY
		stc.[Order], stc.Name

RETURN 0
