CREATE PROCEDURE [dbo].[RabiesTests_Update]
    @p_TestId INT,
	@p_DateTested datetime = NULL,
	@p_DataStatus nvarchar(30) = NULL,
	@p_Year nvarchar(20) =  NULL,
	@p_SubmittingAgency nvarchar(50) = NULL,
	@p_LaboratoryIDNo nvarchar(30) = NULL,
	@p_TestResult nvarchar(15) = NULL,
	@p_Community nvarchar(30) = NULL,
	@p_Latitude float  = NULL,
	@p_Longitude float = NULL,
	@p_RegionId int = NULL,
	@p_GeographicRegion nvarchar(50)  = NULL,
	@p_Species nvarchar(30) = NULL,
	@p_AnimalContact nvarchar(10) = NULL,
	@p_HumanContact nvarchar(10) = NULL,
	@p_Comments nvarchar(max) = NULL,
    @p_modifiedBy nvarchar(50) = NULL
	
AS

	UPDATE
		dbo.RabiesTests
	SET
		DateTested = @p_DateTested,
		DataStatus = @p_DataStatus,
		Year = @p_Year,
		SubmittingAgency = @p_SubmittingAgency,
		LaboratoryIDNo = @p_LaboratoryIDNo,
		TestResult = @p_TestResult,
		Community = @p_Community,
		Latitude = @p_Latitude,
		Longitude = @p_Longitude,
		RegionId = @p_RegionId,
		GeographicRegion = @p_GeographicRegion,
		Species = @p_Species,
		AnimalContact = @p_AnimalContact,
		HumanContact = @p_HumanContact,
		Comments = @p_Comments,
		LastUpdated = GETUTCDATE()
	WHERE
		TestId = @p_TestId
RETURN 0

GRANT EXECUTE ON [dbo].[RabiesTests_Update] TO [WMISUser]
GO


