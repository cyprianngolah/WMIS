CREATE PROCEDURE [dbo].[Survey_Save]
	@p_surveyId INT = NULL,
	@p_projectId INT,
	@p_targetSpeciesId INT,
	@p_surveyTypeId INT,
	@p_surveyTemplateId INT,
	@p_description NVARCHAR(MAX),
	@p_method  NVARCHAR(MAX),
	@p_results NVARCHAR(MAX),
	@p_aircraftType NVARCHAR(MAX),
	@p_aircraftCallsign NVARCHAR(MAX),
	@p_pilot NVARCHAR(MAX),
	@p_leadSurveyor NVARCHAR(MAX),
	@p_surveyCrew NVARCHAR(MAX),
	@p_observerExpertise NVARCHAR(MAX),
	@p_aircraftCrewResults NVARCHAR(MAX),
	@p_cloudCover NVARCHAR(MAX),
	@p_lightConditions NVARCHAR(MAX),
	@p_snowCover NVARCHAR(MAX),
	@p_temperature NVARCHAR(MAX),
	@p_precipitation NVARCHAR(MAX),
	@p_windSpeed NVARCHAR(MAX),
	@p_windDirection NVARCHAR(MAX),
	@p_weatherComments NVARCHAR(MAX),
	@p_startDate DATE = NULL,
	@p_createdBy NVARCHAR (50)
AS
	IF(@p_surveyId IS NULL)
	BEGIN
		INSERT INTO dbo.Survey 
		(
			ProjectId,
			TargetSpeciesId,
			SurveyTypeId,
			SurveyTemplateId,
			[Description],
			Method,
			Results,
			AircraftType,
			AircraftCallsign,
			Pilot,
			LeadSurveyor,
			SurveyCrew,
			ObserverExpertise,
			AircraftCrewResults,
			CloudCover,
			LightConditions,
			SnowCover,
			Temperature,
			Precipitation,
			WindSpeed,
			WindDirection,
			WeatherComments,
			StartDate,
			LastUpdated
		)
		VALUES
		(
			@p_projectId,
			@p_targetSpeciesId,
			@p_surveyTypeId,
			@p_surveyTemplateId,
			@p_description,
			@p_method,
			@p_results,
			@p_aircraftType,
			@p_aircraftCallsign,
			@p_pilot,
			@p_leadSurveyor,
			@p_surveyCrew,
			@p_observerExpertise,
			@p_aircraftCrewResults,
			@p_cloudCover,
			@p_lightConditions,
			@p_snowCover,
			@p_temperature,
			@p_precipitation,
			@p_windSpeed,
			@p_windDirection,
			@p_weatherComments,
			@p_startDate,
			GETUTCDATE()
		)

		SELECT SCOPE_IDENTITY()
		
		--History Log - Survey Created
		INSERT INTO HistoryLogs (SurveyId, Item, Value, ChangeBy) VALUES ((SELECT SCOPE_IDENTITY()), "Survey Created", GETUTCDATE(), @p_createdBy)

	END
	ELSE
	BEGIN
		UPDATE
			dbo.Survey
		SET
			ProjectId = @p_projectId,
			TargetSpeciesId = @p_targetSpeciesId,
			SurveyTypeId = @p_surveyTypeId,
			SurveyTemplateId = @p_surveyTemplateId,
			[Description] = @p_description,
			Method = @p_method,
			Results = @p_results,
			AircraftType = @p_aircraftType,
			AircraftCallsign = @p_aircraftCallsign,
			Pilot = @p_pilot,
			LeadSurveyor = @p_leadSurveyor,
			SurveyCrew = @p_surveyCrew,
			ObserverExpertise = @p_observerExpertise,
			AircraftCrewResults = @p_aircraftCrewResults,
			CloudCover = @p_cloudCover,
			LightConditions = @p_lightConditions,
			SnowCover = @p_snowCover,
			Temperature = @p_temperature,
			Precipitation = @p_precipitation,
			WindSpeed = @p_windSpeed,
			WindDirection = @p_windDirection,
			WeatherComments = @p_weatherComments,
			StartDate = @p_startDate,
			LastUpdated = GETUTCDATE()
		WHERE
			SurveyId = @p_surveyId

		SELECT @p_surveyId
	END
GO

GRANT EXECUTE ON [dbo].[Survey_Save] TO [WMISUser]
GO
