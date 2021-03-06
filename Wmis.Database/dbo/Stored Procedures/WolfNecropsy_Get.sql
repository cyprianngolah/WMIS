CREATE PROCEDURE [dbo].[WolfNecropsy_Get]
	@p_caseId INT = 0,
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_necropsyId NVARCHAR(30) = NULL,
	@p_commonname NVARCHAR(30) = NULL,
	@p_location NVARCHAR(50) = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
	COUNT(*) OVER() AS [TotalCount], 
	p.CaseId AS [Key], 
	p.NecropsyId,
	p.CommonName,
	p.SpeciesId,
	p.NecropsyDate,
	p.Sex,
	p.Location,
	p.GridCell,
	p.DateReceived,
	p.DateKilled,
	p.AgeClass,
	p.AgeEstimated,
	p.Submitter,
	p.ContactInfo,
	p.RegionId,
	p.MethodKilled,
	p.Injuries,
	p.TagComments,
	p.TagReCheck,
	p.BodyWt_unskinned,
	p.NeckGirth_unsk,
	p.ChestGirth_unsk,
	p.Contour_Nose_Tail,
	p.Tail_Length,
	p.BodyWt_skinned,
	p.PeltWt,
	p.NeckGirth_sk,
	p.ChestGirth_sk,
	p.RumpFat,
	p.TotalRank_Ext,
	p.Tongue,
	p.HairCollected,
	p.SkullCollected,
	p.HindLegMuscle_StableIsotopes,
	p.HindLegMuscle_Contaminants,
	p.Femur,
	p.Feces,
	p.Diaphragm,
	p.Lung,
	p.Liver_DNA,
	p.Liver_SIA,
	p.Liver_Contam,
	p.Spleen,
	p.KidneyL,
	p.KidneyL_wt,
	p.KidneyR,
	p.KidneyR_wt,
	p.Blood_tabs,
	p.Blood_tubes,
	p.Stomach,
	p.StomachCont,
	p.Stomach_Full,
	p.Stomach_Empty,
	p.StomachCont_wt,
	p.StomachContentDesc,
	p.intestinalTract,
	p.UterineScars,
	p.Uterus,
	p.Ovaries,
	p.LymphNodes,
	p.Others,
	p.internalRank,
	p.PeltColor,
	p.BackFat,
	p.SternumFat,
	p.InguinalFat,
	p.Incentive,
	p.IncentiveAmt,
	p.Conflict,
	p.GroupSize,
	p.PackId,
	p.Xiphoid,
	p.Personnel,
	p.Pictures,
	p.SpeciesComments,
	p.TagInjuryComments,
	p.InjuryComments,
	p.ExamInjuryComments,
	p.ExamComments,
	p.PicturesComments,
	p.MeasurementsComments,
	p.MissingPartsComments,
	p.StomachContents,
	p.OtherSamplesComments,
	p.SamplesComments,
	p.GeneralComments,
	p.LastUpdated

	FROM
		dbo.WolfNecropsy p	
	WHERE
       (@p_CaseId IS NULL OR p.CaseId = @p_caseId)
	    AND (@p_necropsyId IS NULL OR p.[necropsyId] = @p_necropsyId)
		AND (@p_commonname IS NULL OR p.[commonname] = @p_commonname)
		AND (@p_location IS NULL OR p.[Location] = @p_location)
		AND (
			@p_keywords IS NULL
			OR p.[NecropsyId] LIKE '%'+IsNull(p.[NecropsyId],@p_keywords)
			OR p.[CommonName] LIKE '%'+IsNull(p.[CommonName],@p_keywords)
			OR p.[Location] LIKE '%'+IsNull(p.[Location],@p_keywords)
		   )
	ORDER BY
		CASE WHEN @p_sortBy = 'key' AND @p_sortDirection = '0'
			THEN p.[NecropsyId] END ASC,
		CASE WHEN @p_sortBy = 'key' AND @p_sortDirection = '1'
			THEN p.[necropsyId] END DESC,
		CASE WHEN @p_sortBy = 'CommonName' AND @p_sortDirection = '0'
			THEN p.[CommonName] END ASC,
		CASE WHEN @p_sortBy = 'CommonName' AND @p_sortDirection = '1'
			THEN p.[CommonName] END DESC,
		CASE WHEN @p_sortBy = 'Location' AND @p_sortDirection = '0'
			THEN p.[Location] END ASC,
		CASE WHEN @p_sortBy = 'Location' AND @p_sortDirection = '1'
			THEN p.[Location] END DESC
	
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY
RETURN 0

GRANT EXECUTE ON [dbo].[WolfNecropsy_Get] TO [WMISUser]