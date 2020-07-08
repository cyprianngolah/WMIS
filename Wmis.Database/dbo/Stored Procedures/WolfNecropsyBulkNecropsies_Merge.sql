CREATE PROCEDURE [dbo].[WolfNecropsyBulkNecropsies_Merge]
	@p_necropsiesList AS [dbo].[BulkNecropsiesUploadTableType] READONLY
AS
	
	MERGE WolfNecropsy AS T
	USING @p_necropsiesList AS S
	ON (T.NecropsyId = S.NecropsyID)
		
	WHEN NOT MATCHED BY TARGET THEN
		INSERT(NecropsyId,	CommonName,	SpeciesId,	NecropsyDate,	Sex,	Location,	GridCell,	DateReceived,	DateKilled,	AgeClass,	AgeEstimated,	Submitter,	ContactInfo,	RegionId,	MethodKilled,	Injuries,	TagComments,	TagReCheck,	BodyWt_unskinned,	NeckGirth_unsk,	ChestGirth_unsk,	Contour_Nose_Tail,	Tail_Length,	BodyWt_skinned,	PeltWt,	NeckGirth_sk,	ChestGirth_sk,	RumpFat,	TotalRank_Ext,	Tongue,	HairCollected,	SkullCollected,	HindLegMuscle_StableIsotopes,	HindLegMuscle_Contaminants,	Femur,	Feces,	Diaphragm,	Lung,	Liver_DNA,	Liver_SIA,	Liver_Contam,	Spleen,	KidneyL,	KidneyL_wt,	KidneyR,	KidneyR_wt,	Blood_tabs,	Blood_tubes,	Stomach,	StomachCont,	Stomach_Full,	Stomach_Empty,	StomachCont_wt,	StomachContentDesc,	IntestinalTract,	UterineScars,	Uterus,	Ovaries,	LymphNodes,	Others,	InternalRank,	PeltColor,	BackFat,	SternumFat,	InguinalFat,	Incentive,	IncentiveAmt,	Conflict,	GroupSize,	PackId,	Xiphoid,	Personnel,	Pictures,	SpeciesComments,	TagInjuryComments,	InjuryComments,	ExamInjuryComments,	ExamComments,	PicturesComments,	MeasurementsComments,	MissingPartsComments,	StomachContents,	OtherSamplesComments,	SamplesComments,GeneralComments, LastUpdated)
		VALUES (S.NecropsyId,	S.CommonName,	S.SpeciesId,	S.NecropsyDate,	S.Sex,	S.Location,	S.GridCell,	S.DateReceived,	S.DateKilled,	S.AgeClass,	S.AgeEstimated,	S.Submitter,	S.ContactInfo,	S.RegionId,	S.MethodKilled,	S.Injuries,	S.TagComments,	S.TagReCheck,	S.BodyWt_unskinned,	S.NeckGirth_unsk,	S.ChestGirth_unsk,	S.Contour_Nose_Tail,	S.Tail_Length,	S.BodyWt_skinned,	S.PeltWt,	S.NeckGirth_sk,	S.ChestGirth_sk,	S.RumpFat,	S.TotalRank_Ext,	S.Tongue,	S.HairCollected,	S.SkullCollected,	S.HindLegMuscle_StableIsotopes,	S.HindLegMuscle_Contaminants,	S.Femur,	S.Feces,	S.Diaphragm,	S.Lung,	S.Liver_DNA,	S.Liver_SIA,	S.Liver_Contam,	S.Spleen,	S.KidneyL,	S.KidneyL_wt,	S.KidneyR,	S.KidneyR_wt,	S.Blood_tabs,	S.Blood_tubes,	S.Stomach,	S.StomachCont,	S.Stomach_Full,	S.Stomach_Empty,	S.StomachCont_wt,	S.StomachContentDesc,	S.IntestinalTract,	S.UterineScars,	S.Uterus,	S.Ovaries,	S.LymphNodes,	S.Others,	S.InternalRank,	S.PeltColor,	S.BackFat,	S.SternumFat,	S.InguinalFat,	S.Incentive,	S.IncentiveAmt,	S.Conflict,	S.GroupSize,	S.PackId,	S.Xiphoid,	S.Personnel,	S.Pictures,	S.SpeciesComments,	S.TagInjuryComments,	S.InjuryComments,	S.ExamInjuryComments,	S.ExamComments,	S.PicturesComments,	S.MeasurementsComments,	S.MissingPartsComments,	S.StomachContents,	S.OtherSamplesComments,	S.SamplesComments,	S.GeneralComments, getDate());

RETURN 0

GRANT EXECUTE ON [dbo].[WolfNecropsyBulkNecropsies_Merge] TO [WMISUser]

GO

