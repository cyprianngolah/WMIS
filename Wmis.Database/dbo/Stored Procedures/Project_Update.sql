CREATE PROCEDURE [dbo].[Project_Update]
	@p_projectId INT,
	@p_wildlifeResearchPermitNum NVARCHAR(250),
	@p_name NVARCHAR(250) = NULL,
	@p_projectNumber NVARCHAR(50) = NULL,
	@p_leadRegionId INT = NULL,
	@p_projectStatusId INT = NULL,
	@p_statusDate DATE = NULL,
	@p_projectLeadId INT = NULL,
	@p_startDate DATE = NULL,
	@p_endDate DATE = NULL,
	@p_isSensitiveData BIT = NULL,
	@p_description NVARCHAR(MAX) = NULL,
	@p_objectives NVARCHAR(MAX) = NULL,
	@p_studyArea NVARCHAR(MAX) = NULL,
	@p_methods NVARCHAR(MAX) = NULL,
	@p_comments NVARCHAR(MAX) = NULL,
	@p_results NVARCHAR(MAX) = NULL,
	@p_termsAndConditions NVARCHAR(MAX) = NULL,
	@p_ChangeBy NVARCHAR(50) = NULL
AS
	
	--Project Name
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_name IS NOT NULL
		AND Name != @p_name
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Project Name",@p_name, @p_ChangeBy)
	END

	--NWT WRP ID
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_wildlifeResearchPermitNum IS NOT NULL
		AND WildlifeResearchPermitNumber != @p_wildlifeResearchPermitNum
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "NWT WRP ID",@p_wildlifeResearchPermitNum, @p_ChangeBy)
	END

	--Lead Region
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_leadRegionId IS NOT NULL
		AND LeadRegionId != @p_leadRegionId
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Lead Region",(select Name from LeadRegion where LeadRegionId = @p_leadRegionId), @p_ChangeBy)
	END

	--Projcet Lead
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_projectLeadId IS NOT NULL
		AND ProjectLeadId != @p_projectLeadId
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Project Lead",(Select Name from Person where PersonId = @p_projectLeadId), @p_ChangeBy)
	END

	--Project Status Date
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_statusDate IS NOT NULL
		AND StatusDate != @p_statusDate
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Project Status Date",@p_statusDate, @p_ChangeBy)
	END

	--Start Date
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_startDate IS NOT NULL
		AND StartDate != @p_startDate
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Start Date",@p_startDate, @p_ChangeBy)
	END

	--End Date
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_endDate IS NOT NULL
		AND EndDate != @p_endDate
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "End Date",@p_endDate, @p_ChangeBy)
	END

	--Description
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_description IS NOT NULL
		AND [Description] != @p_description
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Description",@p_description, @p_ChangeBy)
	END

	--Objectives
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_objectives IS NOT NULL
		AND Objectives != @p_objectives
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Objectives",@p_objectives, @p_ChangeBy)
	END

	--Study Area
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_studyArea IS NOT NULL
		AND StudyArea != @p_studyArea
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Study Area",@p_studyArea, @p_ChangeBy)
	END

	--Methods
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_methods IS NOT NULL
		AND Methods != @p_methods
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Methods",@p_methods, @p_ChangeBy)
	END

	--Comments
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_comments IS NOT NULL
		AND Comments != @p_comments
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Comments",@p_comments, @p_ChangeBy)
	END

	--Results
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_results IS NOT NULL
		AND Results != @p_results
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Results",@p_results, @p_ChangeBy)
	END

	--Terms and Conditions
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_termsAndConditions IS NOT NULL
		AND TermsAndConditions != @p_termsAndConditions
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Terms and Condition",@p_termsAndConditions, @p_ChangeBy)
	END

	--Project Status
	IF EXISTS (SELECT 1 FROM dbo.Project WHERE
		ProjectId = @p_projectId
		AND @p_projectStatusId IS NOT NULL
		AND ProjectStatusId != @p_projectStatusId
	)
	BEGIN
		INSERT INTO HistoryLogs (ProjectId, Item, Value, ChangeBy) VALUES (@p_projectId, "Project Status",(Select Name from ProjectStatus where ProjectStatusId = @p_projectStatusId), @p_ChangeBy)
	END



	UPDATE
		dbo.Project
	SET
		Name = @p_name,
		ProjectNumber = @p_projectNumber,
		WildlifeResearchPermitNumber = @p_wildlifeResearchPermitNum,
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
		Results = @p_results,
		TermsAndConditions = @p_termsAndConditions,
		LastUpdated = GETUTCDATE()
	WHERE
		ProjectId = @p_projectId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Project_Update] TO [WMISUser]
GO
