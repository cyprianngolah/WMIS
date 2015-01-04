CREATE PROCEDURE [dbo].[Observation_Get]
	@p_surveyId INT = NULL,
	@p_observationUploadId INT = NULL
AS

	SELECT DISTINCT
		-- SurveyTemplateColumn
		stc.SurveyTemplateColumnId as [Key]
		, stc.SurveyTemplateId as SurveyTemplateKey
		, stc.Name
		, stc.[Order]
		, stc.[IsRequired]
		-- SurveyTemplateColumnType
		, stct.SurveyTemplateColumnTypeId as [Key]
		, stct.Name
	FROM	
		dbo.ObservationUploads ou 
			INNER JOIN dbo.Project p on ou.ProjectId = p.ProjectId
			INNER JOIN dbo.Survey s on p.ProjectId = s.ProjectId
			INNER JOIN dbo.SurveyTemplate st on s.SurveyTemplateId = st.SurveyTemplateId
			INNER JOIN dbo.SurveyTemplateColumns stc on st.SurveyTemplateId = stc.SurveyTemplateId
			INNER JOIN dbo.SurveyTemplateColumnTypes stct on stc.SurveyTemplateColumnTypeId = stct.SurveyTemplateColumnTypeId
			LEFT OUTER JOIN [dbo].[ObservationUploadSurveyTemplateColumnMappings] oustcm ON stc.SurveyTemplateColumnId = oustcm.SurveyTemplateColumnId AND oustcm.ObservationUploadId = ou.ObservationUploadId
	WHERE
		(@p_surveyId IS NULL OR s.SurveyId = @p_surveyId)
		AND (@p_observationUploadId IS NULL OR ou.ObservationUploadId = @p_observationUploadId)
	ORDER BY
		stc.[Order], stc.Name

	-- Dynamic Sql to allow us to pivot a dynamic number of Survey Template Columns into a regular table structure
	DECLARE @cols NVARCHAR(2000)
	SELECT  @cols = STUFF(
		( 
			SELECT DISTINCT TOP 100 PERCENT
				'], [' + c.Name
			FROM 
				(
					SELECT DISTINCT TOP 100 PERCENT
						stc.Name, stc.[Order]
					FROM	
						dbo.SurveyTemplateColumns stc 
							INNER JOIN dbo.SurveyTemplate st on st.SurveyTemplateId = stc.SurveyTemplateId
							INNER JOIN dbo.Survey s on s.SurveyTemplateId = st.SurveyTemplateId
							INNER JOIN dbo.Project p on s.ProjectId = p.ProjectId
							INNER JOIN dbo.ObservationUploads ou on ou.ProjectId = p.ProjectId
					WHERE
						(@p_surveyId IS NULL OR s.SurveyId = @p_surveyId)
						AND (@p_observationUploadId IS NULL OR ou.ObservationUploadId = @p_observationUploadId)
					ORDER BY	
						stc.[Order]
				) c
			FOR XML PATH('')
		), 1, 2, '') + ']'

	DECLARE 
		@surveyId NVARCHAR(10) = ISNULL(CAST(@p_surveyId AS NVARCHAR(10)), 'NULL'),
		@observationUploadId NVARCHAR(10) = ISNULL(CAST(@p_observationUploadId AS NVARCHAR(10)), 'NULL')


	DECLARE @query NVARCHAR(4000)
	SET @query = 
		N'SELECT 
			ObservationUploadId, RowIndex,' + @cols + '
		FROM
			(
				SELECT
					  oustcm.ObservationUploadId, o.RowIndex, stc.Name, o.Value
				FROM	
					dbo.SurveyTemplateColumns stc 
						INNER JOIN dbo.SurveyTemplate st on st.SurveyTemplateId = stc.SurveyTemplateId
						INNER JOIN dbo.Survey s on s.SurveyTemplateId = st.SurveyTemplateId
						INNER JOIN dbo.Project p on s.ProjectId = p.ProjectId
						INNER JOIN dbo.ObservationUploads ou on ou.ProjectId = p.ProjectId
						INNER JOIN dbo.ObservationUploadSurveyTemplateColumnMappings oustcm on ou.ObservationUploadId = oustcm.ObservationUploadId AND oustcm.SurveyTemplateColumnId = stc.SurveyTemplateColumnId
						INNER JOIN dbo.Observations o on o.ObservationUploadSurveyTemplateColumnMappingId = oustcm.ObservationUploadSurveyTemplateColumnMappingId

				WHERE
					(' + @surveyId + ' IS NULL OR s.SurveyId = ' + @surveyId + ')
					AND (' + @observationUploadId + ' IS NULL OR ou.ObservationUploadId = ' + @observationUploadId + ')
					AND (' + @surveyId + ' IS NULL OR (ou.ObservationUploadStatusId = 4 AND ou.IsDeleted = 0))
			) as pvt
		PIVOT
		(
			MAX(Value)
			FOR Name IN ('+ @cols + ')
		) AS p
		ORDER BY
			ObservationUploadId, RowIndex'

	EXEC (@query)
RETURN 0
