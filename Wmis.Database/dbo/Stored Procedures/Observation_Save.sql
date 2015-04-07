CREATE PROCEDURE [dbo].[Observation_Save]
	@p_observationUploadId INT,
	@p_observations [dbo].[ObservationTableType] READONLY
AS
	-- Merge the ObservationRow columns first
	-- This is a bit weird because we actually take the Latitude, Longitude and Timestamp columns directly into the ObservationRow table
	-- and then leave any remaining data as values that go into Observation
	-- Get the ObservationUploadSurveyTemplateColumnMappingIds for Latitude, Longitude and Timestamp
	DECLARE @v_latitude INT, @v_longitude INT, @v_timestamp INT, @v_siteId INT, @v_projectId INT;
	SELECT
		@v_latitude = CASE WHEN stc.Name = 'Latitude' THEN oustcm.ObservationUploadSurveyTemplateColumnMappingId ELSE @v_latitude END,
		@v_longitude = CASE WHEN stc.Name = 'Longitude' THEN oustcm.ObservationUploadSurveyTemplateColumnMappingId ELSE @v_longitude END,
		@v_timestamp = CASE WHEN stc.Name = 'Timestamp' THEN oustcm.ObservationUploadSurveyTemplateColumnMappingId ELSE @v_timestamp END,
		@v_siteId = CASE WHEN stc.Name = 'SiteId' THEN oustcm.ObservationUploadSurveyTemplateColumnMappingId ELSE @v_siteId END
	FROM
		dbo.ObservationUploadSurveyTemplateColumnMappings oustcm
			INNER JOIN dbo.SurveyTemplateColumns stc on oustcm.SurveyTemplateColumnId = stc.SurveyTemplateColumnId
	WHERE
		oustcm.ObservationUploadId = @p_observationUploadId
		
	-- Check that the sites in the data are sites associated with the current project
	SELECT @v_projectId = ProjectId
	FROM dbo.[Survey] s
		INNER JOIN dbo.[ObservationUploads] u ON u.SurveyId = s.SurveyId
	WHERE u.ObservationUploadId = @p_observationUploadId;

	IF EXISTS (
		SELECT o.Value
		FROM 
			@p_observations o
			INNER JOIN dbo.ObservationUploadSurveyTemplateColumnMappings oustcm on o.ObservationUploadSurveyTemplateColumnMappingId = oustcm.ObservationUploadSurveyTemplateColumnMappingId
			INNER JOIN dbo.SurveyTemplateColumns stc on oustcm.SurveyTemplateColumnId = stc.SurveyTemplateColumnId
		WHERE
			oustcm.ObservationUploadId = @p_observationUploadId
			AND o.ObservationUploadSurveyTemplateColumnMappingId = @v_siteId
			AND o.Value NOT IN (SELECT CAST(SiteId AS NVARCHAR(50)) FROM dbo.[Sites] s WHERE s.ProjectId = @v_projectId)
	) 
	BEGIN	
		RAISERROR('Error: Sites found in upload which are not associated with this Project', 11,1)
	END

	-- Merge the Observation Records
	;WITH AffectedMappings as 
	(
		SELECT 
			o.*
		FROM 
			dbo.ObservationRows o 
		WHERE
			o.ObservationUploadId = @p_observationUploadId
	)
	MERGE AffectedMappings AS T
	USING 
	(
		SELECT 
			ObservationUploadId, RowIndex, [Latitude], [Longitude], [Timestamp], [SiteId]
		FROM
			(
				SELECT
					oustcm.ObservationUploadId, o.RowIndex, stc.Name, o.Value
				FROM	
					@p_observations o
						INNER JOIN dbo.ObservationUploadSurveyTemplateColumnMappings oustcm on o.ObservationUploadSurveyTemplateColumnMappingId = oustcm.ObservationUploadSurveyTemplateColumnMappingId
						INNER JOIN dbo.SurveyTemplateColumns stc on oustcm.SurveyTemplateColumnId = stc.SurveyTemplateColumnId
				WHERE
					oustcm.ObservationUploadId = @p_observationUploadId
					AND o.ObservationUploadSurveyTemplateColumnMappingId IN (@v_latitude, @v_longitude, @v_timestamp, @v_siteId)
			) as pvt
		PIVOT
		(
			MAX(Value)
			FOR Name IN (Latitude, Longitude, Timestamp, SiteId)
		) AS p
	) AS S
	ON 
	(	
		T.ObservationUploadId = s.ObservationUploadId
		AND T.[RowIndex] = S.[RowIndex]
	) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT([ObservationUploadId], [RowIndex], [Latitude], [Longitude], [Timestamp], [SiteId], [ObservationRowStatusId]) 
		VALUES(s.ObservationUploadId, s.[RowIndex], s.[Latitude], s.[Longitude], s.[Timestamp], s.[SiteId], null)
	WHEN MATCHED
		THEN UPDATE SET 
			[Latitude] = s.[Latitude], 
			[Longitude] = s.[Longitude], 
			[Timestamp] = s.[Timestamp],
			[SiteId] = s.[SiteId]
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 

	-- Merge the Observation Records
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
	USING 
	(
		SELECT
			oustcm.[ObservationUploadSurveyTemplateColumnMappingId], oustcm.ObservationUploadId, ors.ObservationRowId, stc.Name, o.Value
		FROM	
			@p_observations o
				INNER JOIN dbo.ObservationRows ors ON o.RowIndex = ors.RowIndex AND ors.ObservationUPloadId = @p_observationUploadId
				INNER JOIN dbo.ObservationUploadSurveyTemplateColumnMappings oustcm on o.ObservationUploadSurveyTemplateColumnMappingId = oustcm.ObservationUploadSurveyTemplateColumnMappingId
				INNER JOIN dbo.SurveyTemplateColumns stc on oustcm.SurveyTemplateColumnId = stc.SurveyTemplateColumnId
		WHERE
			oustcm.ObservationUploadId = @p_observationUploadId
			AND o.ObservationUploadSurveyTemplateColumnMappingId NOT IN (@v_latitude, @v_longitude, @v_timestamp, @v_siteId)
	) AS S
	ON 
	(	
		T.[ObservationUploadSurveyTemplateColumnMappingId] = s.[ObservationUploadSurveyTemplateColumnMappingId]
		AND T.[ObservationRowId] = s.[ObservationRowId]
	) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT([ObservationRowId], [ObservationUploadSurveyTemplateColumnMappingId], [Value]) 
		VALUES(s.[ObservationRowId], s.[ObservationUploadSurveyTemplateColumnMappingId], s.[Value])
	WHEN MATCHED
		THEN UPDATE SET 
			[Value] = s.[Value]
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 
GO

GRANT EXECUTE ON [dbo].[Observation_Save] TO [WMISUser]
GO