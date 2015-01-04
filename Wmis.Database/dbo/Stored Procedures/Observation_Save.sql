CREATE PROCEDURE [dbo].[Observation_Save]
	@p_observationUploadId INT,
	@p_observations [dbo].[ObservationTableType] READONLY
AS
	WITH AffectedMappings as 
	(
		SELECT 
			o.*
		FROM 
			dbo.Observations o 
				INNER JOIN dbo.[ObservationUploadSurveyTemplateColumnMappings] oustcm ON o.ObservationUploadSurveyTemplateColumnMappingId = oustcm.ObservationUploadSurveyTemplateColumnMappingId			
		WHERE
			oustcm.ObservationUploadId = @p_observationUploadId
	)
	MERGE AffectedMappings AS T
	USING @p_observations AS S
	ON 
	(	
		T.[ObservationUploadSurveyTemplateColumnMappingId] = s.[ObservationUploadSurveyTemplateColumnMappingId]
		AND T.[RowIndex] = S.[RowIndex]
	) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT([ObservationUploadSurveyTemplateColumnMappingId], [RowIndex], [Value]) 
		VALUES(s.[ObservationUploadSurveyTemplateColumnMappingId], s.[RowIndex], s.[Value])
	WHEN MATCHED
		THEN UPDATE SET 
			[Value] = s.[Value]
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 
GO

GRANT EXECUTE ON [dbo].[Observation_Save] TO [WMISUser]
GO