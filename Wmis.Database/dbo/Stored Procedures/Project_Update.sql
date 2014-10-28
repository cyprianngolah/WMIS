﻿CREATE PROCEDURE [dbo].[Project_Update]
	@p_projectId INT,
	@p_wildlifeResearchPermitId INT,
	@p_name NVARCHAR(50) = NULL,
	@p_leadRegionId INT = NULL,
	@p_projectStatusId INT = NULL,
	@p_statusDate DATETIME = NULL,
	@p_projectLeadId INT = NULL,
	@p_startDate DATETIME = NULL,
	@p_endDate DATETIME = NULL,
	@p_isSensitiveData BIT = NULL,
	@p_description NVARCHAR(MAX) = NULL,
	@p_objectives NVARCHAR(MAX) = NULL,
	@p_studyArea NVARCHAR(MAX) = NULL,
	@p_methods NVARCHAR(MAX) = NULL,
	@p_comments NVARCHAR(MAX) = NULL,
	@p_results NVARCHAR(MAX) = NULL

AS
	UPDATE
		dbo.Project
	SET
		Name = @p_name,
		WildlifeResearchPermitId = @p_wildlifeResearchPermitId,
		LeadRegionId = @p_leadRegionId,
		ProjectStatusId = @p_projectStatusId,
		StatusDate = @p_statusDate,
		ProjectLeadId = @p_projectLeadId,
		StartDate = @p_startDate,
		EndDate = @p_endDate,
		IsSensitiveData = @p_isSensitiveData,
		[Description] = @p_description,
		Objectives = @p_objectives,
		StudyArea = @p_studyArea,
		Methods = @p_methods,
		Comments = @p_comments,
		Results = @p_results
	WHERE
		ProjectId = @p_projectId

GRANT EXECUTE ON [dbo].[Project_Update] TO [WMISUser]
GO