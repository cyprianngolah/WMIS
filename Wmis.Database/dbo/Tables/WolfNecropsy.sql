CREATE TABLE [dbo].[WolfNecropsy]
(
	[CaseId] INT NOT NULL IDENTITY,
	[NecropsyId] [nvarchar](30) NOT NULL,
	[CommonName] [nvarchar](30) NULL,
	[SpeciesId] [int] NULL,
	[NecropsyDate] [date] NULL,
	[Sex] [nvarchar](10) NULL,
	[Location] [nvarchar](50) NULL,
	[GridCell] [int] NULL,
	[DateReceived] [date] NULL,
	[DateKilled] [date] NULL,
	[AgeClass] [nvarchar](10) NULL,
	[AgeEstimated] [float] NULL,
	[Submitter] [nvarchar](50) NULL,
	[ContactInfo] [nvarchar](50) NULL,
	[RegionId] [int] NULL,
	[MethodKilled] [nvarchar](30) NULL,
	[Injuries] [bit] NULL,
	[TagComments] [nvarchar](max) NULL,
	[TagReCheck] [bit] NULL,
	[BodyWt_unskinned] [float] NULL,
	[NeckGirth_unsk] [float] NULL,
	[ChestGirth_unsk] [float] NULL,
	[Contour_Nose_Tail] [float] NULL,
	[Tail_Length] [float] NULL,
	[BodyWt_skinned] [float] NULL,
	[PeltWt] [float] NULL,
	[NeckGirth_sk] [float] NULL,
	[ChestGirth_sk] [float] NULL,
	[RumpFat] [float] NULL,
	[TotalRank_Ext] [float] NULL,
	[Tongue] [bit] NULL,
	[HairCollected] [bit] NULL,
	[SkullCollected] [bit] NULL,
	[HindLegMuscle_StableIsotopes] [bit] NULL,
	[HindLegMuscle_Contaminants] [bit] NULL,
	[Femur] [bit] NULL,
	[Feces] [bit] NULL,
	[Diaphragm] [bit] NULL,
	[Lung] [bit] NULL,
	[Liver_DNA] [bit] NULL,
	[Liver_SIA] [bit] NULL,
	[Liver_Contam] [bit] NULL,
	[Spleen] [bit] NULL,
	[KidneyL] [bit] NULL,
	[KidneyL_wt] [float] NULL,
	[KidneyR] [bit] NULL,
	[KidneyR_wt] [float] NULL,
	[Blood_tabs] [bit] NULL,
	[Blood_tubes] [bit] NULL,
	[Stomach] [bit] NULL,
	[StomachCont] [bit] NULL,
	[Stomach_Full] [bit] NULL,
	[Stomach_Empty] [bit] NULL,
	[StomachCont_wt] [float] NULL,
	[StomachContentDesc] [nvarchar](max) NULL,
	[IntestinalTract] [bit] NULL,
	[UterineScars] [int] NULL,
	[Uterus] [bit] NULL,
	[Ovaries] [bit] NULL,
	[LymphNodes] [bit] NULL,
	[Others] [bit] NULL,
	[InternalRank] [int] NULL,
	[PeltColor] [nvarchar](20) NULL,
	[BackFat] [bit] NULL,
	[SternumFat] [bit] NULL,
	[InguinalFat] [bit] NULL,
	[Incentive] [bit] NULL,
	[IncentiveAmt] [float] NULL,
	[Conflict] [bit] NULL,
	[GroupSize] [int] NULL,
	[PackId] [nvarchar](50) NULL,
	[Xiphoid] [bit] NULL,
	[Personnel] [nvarchar](50) NULL,
	[Pictures] [bit] NULL,
	[SpeciesComments] [nvarchar](max) NULL,
	[TagInjuryComments] [nvarchar](max) NULL,
	[InjuryComments] [nvarchar](max) NULL,
	[ExamInjuryComments] [nvarchar](max) NULL,
	[ExamComments] [nvarchar](max) NULL,
	[PicturesComments] [nvarchar](max) NULL,
	[MeasurementsComments] [nvarchar](max) NULL,
	[MissingPartsComments] [nvarchar](max) NULL,
	[StomachContents] [nvarchar](max) NULL,
	[OtherSamplesComments] [nvarchar](max) NULL,
	[SamplesComments] [nvarchar](max) NULL,
	[GeneralComments] [nvarchar](max) NULL, 
    [LastUpdated] DATETIME NOT NULL 
)