CREATE PROCEDURE [dbo].[Survey_Get]
	@p_surveyId INT
AS
	SELECT TOP 1
		s.[SurveyId] AS [Key], 
		s.[ProjectId] as [ProjectKey],
		s.[Description], 
		s.[Method], 
		s.[Results], 
		s.[AircraftType], 
		s.[AircraftCallsign], 
		s.[Pilot], 
		s.[LeadSurveyor], 
		s.[SurveyCrew], 
		s.[ObserverExpertise], 
		s.[AircraftCrewResults], 
		s.[CloudCover], 
		s.[LightConditions], 
		s.[SnowCover], 
		s.[Temperature], 
		s.[Precipitation], 
		s.[WindSpeed], 
		s.[WindDirection], 
		s.[WeatherComments], 
		s.[LastUpdated],
		s.[TargetSpeciesId] as [Key], 
		sp.[Name],
		sp.[CommonName],
		s.[SurveyTypeId] as [Key], 
		st.[Name],
		s.[SurveyTemplateId] as [Key],
		ste.[Name]
	FROM
		dbo.Survey s
			LEFT OUTER JOIN dbo.Species sp on s.TargetSpeciesId = sp.SpeciesId
			LEFT OUTER JOIN dbo.SurveyType st on s.SurveyTypeId = st.SurveyTypeId
			LEFT OUTER JOIN dbo.SurveyTemplate ste on s.SurveyTemplateId = ste.SurveyTemplateId
	WHERE
		s.[SurveyId] =  @p_surveyId
GO

GRANT EXECUTE ON [dbo].[Survey_Get] TO [WMISUser]
GO