CREATE PROCEDURE [dbo].[Observation_Save]
	@p_observations [dbo].[ObservationTableType] READONLY
AS
	MERGE dbo.[Observations] AS T
	USING @p_observations AS S
	ON (
		T.[ObservationUploadId] = T.[ObservationUploadId] 
		AND T.[ObservationUploadSurveyTemplateColumnMappingId] = s.[ObservationUploadSurveyTemplateColumnMappingId]
		AND T.[RowIndex] = S.[RowIndex]
	) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT([ObservationUploadId], [ObservationUploadSurveyTemplateColumnMappingId], [RowIndex], [Value]) 
		VALUES(s.[ObservationUploadId], s.[ObservationUploadSurveyTemplateColumnMappingId], s.[RowIndex], s.[Value])
	WHEN MATCHED
		THEN UPDATE SET 
			[Value] = s.[Value]
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 
GO

GRANT EXECUTE ON [dbo].[Observation_Save] TO [WMISUser]
GO