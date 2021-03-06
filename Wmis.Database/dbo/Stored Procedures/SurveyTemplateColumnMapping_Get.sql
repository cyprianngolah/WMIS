CREATE PROCEDURE [dbo].[SurveyTemplateColumnMapping_Get]
	@p_observationUploadId int
AS
	
	SELECT
		-- MappedSurveyTemplateColumn
		oustcm.[ObservationUploadSurveyTemplateColumnMappingId] as [Key]
		, @p_observationUploadId as ObservationUploadKey
		, oustcm.[ColumnIndex]
		-- SurveyTemplateColumn
		, stc.SurveyTemplateColumnId as [Key]
		, stc.SurveyTemplateId
		, stc.Name
		, stc.[Order]
		, stc.[IsRequired]
		-- SurveyTemplateColumnType
		, stct.SurveyTemplateColumnTypeId as [Key]
		, stct.Name
	FROM	
		dbo.ObservationUploads ou 
			INNER JOIN dbo.Survey s on ou.SurveyId = s.SurveyId
			INNER JOIN dbo.SurveyTemplate st on s.SurveyTemplateId = st.SurveyTemplateId
			INNER JOIN dbo.SurveyTemplateColumns stc on st.SurveyTemplateId = stc.SurveyTemplateId
			INNER JOIN dbo.SurveyTemplateColumnTypes stct on stc.SurveyTemplateColumnTypeId = stct.SurveyTemplateColumnTypeId
			LEFT OUTER JOIN [dbo].[ObservationUploadSurveyTemplateColumnMappings] oustcm ON stc.SurveyTemplateColumnId = oustcm.SurveyTemplateColumnId AND oustcm.ObservationUploadId = ou.ObservationUploadId
	WHERE
		ou.ObservationUploadId = @p_observationUploadId
	ORDER BY
		stc.[Order], stc.Name

RETURN 0

GRANT EXECUTE ON [dbo].[SurveyTemplateColumnMapping_Get] TO [WMISUser]
GO