CREATE PROCEDURE [dbo].[RabiesTests_Create]
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
	@p_createdBy NVARCHAR (50)
AS
		INSERT INTO 
			dbo.[RabiesTests] (DateTested, DataStatus,Year,SubmittingAgency,LaboratoryIDNo, TestResult, Community,Latitude, Longitude, RegionId, GeographicRegion, Species, AnimalContact, HumanContact,Comments, LastUpdated)
		VALUES
			(@p_DateTested, @p_DataStatus,@p_Year,@p_SubmittingAgency,@p_LaboratoryIDNo, @p_TestResult, @p_Community,@p_Latitude, @p_Longitude, @p_RegionId, @p_GeographicRegion, @p_Species, @p_AnimalContact, @p_HumanContact,@p_Comments,GETUTCDATE())

	SELECT SCOPE_IDENTITY()

	--History Log - WolfNecropsy Created
	INSERT INTO HistoryLogs (HistoryLogId, Item, Value, ChangeBy) VALUES ((SELECT SCOPE_IDENTITY()), " RabiesTests Created", GETUTCDATE(), @p_createdBy)

RETURN 0

GRANT EXECUTE ON [dbo].[RabiesTests_Create] TO [WMISUser]
GO
