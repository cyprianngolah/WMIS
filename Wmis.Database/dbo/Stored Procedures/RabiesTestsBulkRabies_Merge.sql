CREATE PROCEDURE [dbo].[RabiesTestsBulkRabies_Merge]
	@p_rabiestestsList AS [dbo].[BulkRabiesTestsUploadTableType] READONLY
AS
	WITH data AS (
	SELECT 
				p.DateTested,
				p.DataStatus,
				p.Year,
				p.SubmittingAgency,
				p.LaboratoryIDNo,
				p.TestResult,
				p.Community,
				p.Latitude,
				p.Longitude,
				p.RegionId,
				p.GeographicRegion,
				p.Species,
				p.AnimalContact,
				p.HumanContact,
				p.Comments
	FROM @p_rabiestestsList p
	)
	MERGE RabiesTests AS T
	USING data AS S
	ON (T.[Year] = S.[Year])
		
	WHEN NOT MATCHED BY TARGET THEN
		INSERT(DateTested, DataStatus, [Year], SubmittingAgency, LaboratoryIDNo, TestResult, Community, Latitude, Longitude, RegionId, GeographicRegion, Species, AnimalContact, HumanContact,Comments)
		VALUES (S.DateTested, S.DataStatus, S.[Year], S.SubmittingAgency, S.LaboratoryIDNo, S.TestResult, S.Community, S.Latitude, S.Longitude, S.RegionId, S.GeographicRegion, S.Species, S.AnimalContact, S.HumanContact, S.Comments);

RETURN 0

GRANT EXECUTE ON [dbo].[RabiesTestsBulkRabies_Merge] TO [WMISUser]
GO
