namespace Wmis.Models
{
    using Base;
    using System;

    public class WolfNecropsy : KeyedModel
    {
      //  public int CaseId { get; set; }
        public string NecropsyId { get; set; }
        public string CommonName { get; set; }
        public int SpeciesId { get; set; }
        public DateTime? NecropsyDate { get; set; }
        public string Sex { get; set; }
        public string Location { get; set; }
        public int GridCell { get; set; }
        public DateTime? DateReceived { get; set; }
        public DateTime? DateKilled { get; set; }
        public string AgeClass { get; set; }
        public float AgeEstimated { get; set; }
        public string Submitter { get; set; }
        public string ContactInfo { get; set; }
        public int RegionId { get; set; }
        public string MethodKilled { get; set; }
        public bool Injuries { get; set; }
        public string TagComments { get; set; }
        public bool TagReCheck { get; set; }
        public float BodyWt_unskinned { get; set; }
        public float NeckGirth_unsk { get; set; }
        public float ChestGirth_unsk { get; set; }
        public float Contour_Nose_Tail { get; set; }
        public float Tail_Length { get; set; }
        public float BodyWt_skinned { get; set; }
        public float PeltWt { get; set; }
        public float NeckGirth_sk { get; set; }
        public float ChestGirth_sk { get; set; }
        public float RumpFat { get; set; }
        public float TotalRank_Ext {get;set;}
        public bool Tongue { get; set; }
        public bool HairCollected { get; set; }
        public bool SkullCollected { get; set; }
        public bool HindLegMuscle_StableIsotopes { get; set; }
        public bool HindLegMuscle_Contaminants { get; set; }
        public bool Femur { get; set; }
        public bool Feces { get; set; }
        public bool Diaphragm { get; set; }
        public bool Lung { get; set; }
        public bool Liver_DNA { get; set; }
        public bool Liver_SIA { get; set; }
        public bool Liver_Contam { get; set; }
        public bool Spleen { get; set; }
        public bool KidneyL { get; set; }
        public float KidneyL_wt { get; set; }
        public bool KidneyR { get; set; }
        public float KidneyR_wt { get; set; }
        public bool Blood_tabs { get; set; }
        public bool Blood_tubes { get; set; }
        public bool Stomach { get; set; }
        public bool StomachCont { get; set; }
        public bool Stomach_Full { get; set; }
        public bool Stomach_Empty { get; set; }
        public float StomachCont_wt { get; set; }
        public string StomachContentDesc { get; set; }
        public bool IntestinalTract { get; set; }
        public bool UterineScars { get; set; }
        public bool Uterus { get; set; }
        public bool Ovaries { get; set; }
        public bool LymphNodes { get; set; }
        public bool Others { get; set; }
        public int InternalRank { get; set; }
        public string PeltColor { get; set; }
        public bool BackFat { get; set; }
        public bool SternumFat { get; set; }
        public bool InguinalFat { get; set; }
        public bool Incentive { get; set; }
        public float IncentiveAmt { get; set; }
        public bool Conflict { get; set; }
        public int GroupSize { get; set; }
        public string PackId { get; set; }
        public bool Xiphoid { get; set; }
        public string Personnel { get; set; }
        public bool Pictures { get; set; }
        public string SpeciesComments { get; set; }
        public string TagInjuryComments { get; set; }
        public string InjuryComments { get; set; }
        public string ExamInjuryComments { get; set; }
        public string ExamComments { get; set; }
        public string PicturesComments { get; set; }
        public string MeasurementsComments { get; set; }
        public string MissingPartsComments { get; set; }
        public string StomachContents { get; set; }
        public string OtherSamplesComments { get; set; }
        public string SamplesComments { get; set; }
        public string GeneralComments { get; set; }

    }
}