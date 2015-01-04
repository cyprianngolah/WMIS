CREATE TYPE [dbo].[ObservationTableType] AS TABLE 
( 
	[ObservationUploadSurveyTemplateColumnMappingId] INT,
	[RowIndex] INT,
	[Value] NVARCHAR(255)
)
GO

GRANT EXECUTE ON TYPE::[dbo].[ObservationTableType] TO [WMISUser]
GO