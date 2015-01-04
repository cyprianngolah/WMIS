CREATE PROCEDURE [dbo].[SurveyTemplateColumnMapping_Save]
	@p_observationUploadId int,
	@p_templateColumnMappings dbo.TwoIntTableType READONLY
AS
	MERGE dbo.[ObservationUploadSurveyTemplateColumnMappings] AS T
	USING @p_templateColumnMappings AS S
	ON (T.SurveyTemplateColumnId = S.n AND T.[ObservationUploadId] = @p_observationUploadId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT([ObservationUploadId], [SurveyTemplateColumnId], [ColumnIndex]) VALUES(@p_observationUploadId, s.n, s.p)
	WHEN MATCHED
		THEN UPDATE SET 
			[ColumnIndex] = s.p
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 
GO

GRANT EXECUTE ON [dbo].[SurveyTemplateColumnMapping_Save] TO [WMISUser]
GO