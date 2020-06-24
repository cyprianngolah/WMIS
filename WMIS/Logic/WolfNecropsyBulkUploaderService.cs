using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.IO;
using NPOI.SS.UserModel;

namespace Wmis.Logic
{

    public class NecropsyData
    {
        public int RowIndex { get; set; }
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
        public float TotalRank_Ext { get; set; }
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


    public class WolfNecropsyBulkUploaderService
    {
        // get data from the first WorkBook
        public IEnumerable<NecropsyData> GetData(string fileName, int firstDataRowIndex)
        {
            IWorkbook workbook = this.GetWorkbook(fileName);

            var datas = new List<NecropsyData>();
            var sheet = workbook.GetSheetAt(0);

            for (var rowIndex = firstDataRowIndex; rowIndex <= sheet.LastRowNum; rowIndex++)
            {
                var row = sheet.GetRow(rowIndex);
                if (row != null)
                {
                    string vNecropsyId = row.GetCell(0) == null ? string.Empty : row.GetCell(0).StringCellValue;
                    string vCommonName = row.GetCell(1) == null ? string.Empty : row.GetCell(1).StringCellValue; ;
                    int vSpeciesId = (int)row.GetCell(2).NumericCellValue ; ;
                    DateTime? vNecropsyDate = (DateTime?)row.GetCell(3).DateCellValue; ;
                    string vSex = row.GetCell(4) == null ? string.Empty : row.GetCell(4).StringCellValue; ;
                    string vLocation = row.GetCell(5) == null ? string.Empty : row.GetCell(5).StringCellValue; ;
                    int vGridCell = (int)row.GetCell(6).NumericCellValue; ;
                    DateTime? vDateReceived = (DateTime?)row.GetCell(7).DateCellValue; ;
                    DateTime? vDateKilled = (DateTime?)row.GetCell(8).DateCellValue; ;
                    string vAgeClass = row.GetCell(9) == null ? string.Empty : row.GetCell(9).StringCellValue; ;
                    float vAgeEstimated = (float)row.GetCell(10).NumericCellValue; ;
                    string vSubmitter = row.GetCell(11) == null ? string.Empty : row.GetCell(11).StringCellValue; ;
                    string vContactInfo = row.GetCell(12) == null ? string.Empty : row.GetCell(12).StringCellValue; ;
                    int vRegionId = (int)row.GetCell(13).NumericCellValue; ;
                    string vMethodKilled = row.GetCell(14) == null ? string.Empty : row.GetCell(14).StringCellValue; ;
                    bool vInjuries = (bool)row.GetCell(15).BooleanCellValue; ;
                    string vTagComments = row.GetCell(16) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    bool vTagReCheck = (bool)row.GetCell(17).BooleanCellValue; ;
                    float vBodyWt_unskinned = (float)row.GetCell(18).NumericCellValue; ;
                    float vTNeckGirth_unsk = (float)row.GetCell(19).NumericCellValue ; ;
                    float vChestGirth_unsk = (float)row.GetCell(20).NumericCellValue; ;
                    float vContour_Nose_Tail = (float)row.GetCell(21).NumericCellValue; ;
                    float vTail_Length = (float)row.GetCell(22).NumericCellValue; ;
                    float vBodyWt_skinned = (float)row.GetCell(23).NumericCellValue; ;
                    float vPeltWt = (float)row.GetCell(24).NumericCellValue; ;
                    float vNeckGirth_sk = (float)row.GetCell(25).NumericCellValue; ;
                    float vChestGirth_sk = (float)row.GetCell(26).NumericCellValue; ;
                    float vRumpFat = (float)row.GetCell(27).NumericCellValue; ;
                    float vTotalRank_Ext = (float)row.GetCell(28).NumericCellValue; ;
                    bool vTongue = (bool)row.GetCell(29).BooleanCellValue; ;
                    bool vHairCollected = (bool)row.GetCell(30).BooleanCellValue; ;
                    bool vSkullCollected = (bool)row.GetCell(31).BooleanCellValue; ;
                    bool vHindLegMuscle_StableIsotopes = (bool)row.GetCell(32).BooleanCellValue; ;
                    bool vHindLegMuscle_Contaminants = (bool)row.GetCell(33).BooleanCellValue; ;
                    bool vFemur = (bool)row.GetCell(34).BooleanCellValue; ;
                    bool vFeces = (bool)row.GetCell(35).BooleanCellValue; ;
                    bool vDiaphragm = (bool)row.GetCell(36).BooleanCellValue; ;
                    bool vLung = (bool)row.GetCell(37).BooleanCellValue; ;
                    bool vLiver_DNA = (bool)row.GetCell(38).BooleanCellValue; ;
                    bool vLiver_SIA = (bool)row.GetCell(39).BooleanCellValue; ;
                    bool vLiver_Contam = (bool)row.GetCell(40).BooleanCellValue; ;
                    bool vSpleen = (bool)row.GetCell(41).BooleanCellValue; ;
                    bool vKidneyL = (bool)row.GetCell(42).BooleanCellValue; ;
                    float vKidneyL_wt = (float)row.GetCell(43).NumericCellValue; ;
                    bool vKidneyR = (bool)row.GetCell(44).BooleanCellValue; ;
                    float vKidneyR_wt = (float)row.GetCell(45).NumericCellValue; ;
                    bool vBlood_tabs = (bool)row.GetCell(46).BooleanCellValue; ;
                    bool vBlood_tubes = (bool)row.GetCell(47).BooleanCellValue; ;
                    bool vStomach = (bool)row.GetCell(48).BooleanCellValue; ;
                    bool vStomachCont = (bool)row.GetCell(49).BooleanCellValue; ;
                    bool vStomach_Full = (bool)row.GetCell(50).BooleanCellValue; ;
                    bool vStomach_Empty = (bool)row.GetCell(51).BooleanCellValue; ;
                    float vStomachCont_wt = (float)row.GetCell(52).NumericCellValue; ;
                    string vStomachContentDesc = row.GetCell(53) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    bool vIntestinalTract = (bool)row.GetCell(54).BooleanCellValue; ;
                    bool vUterineScars = (bool)row.GetCell(55).BooleanCellValue; ;
                    bool vUterus = (bool)row.GetCell(56).BooleanCellValue; ;
                    bool vOvaries = (bool)row.GetCell(57).BooleanCellValue; ;
                    bool vLymphNodes = (bool)row.GetCell(58).BooleanCellValue; ;
                    bool vOthers = row.GetCell(59).BooleanCellValue; ;
                    int vInternalRank = (int)row.GetCell(60).NumericCellValue; ;
                    string vPeltColor = row.GetCell(61) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    bool vBackFat = (bool)row.GetCell(62).BooleanCellValue; ;
                    bool vSternumFat = (bool)row.GetCell(63).BooleanCellValue; ;
                    bool vInguinalFat = (bool)row.GetCell(64).BooleanCellValue; ;
                    bool vIncentive = (bool)row.GetCell(65).BooleanCellValue; ;
                    float vncentiveAmt = (float)row.GetCell(66).NumericCellValue; ;
                    bool vConflict = (bool)row.GetCell(67).BooleanCellValue; ;
                    int vGroupSize = (int)row.GetCell(68).NumericCellValue; ;
                    string vPackId = row.GetCell(69) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    bool vXiphoid = (bool)row.GetCell(70).BooleanCellValue; ;
                    string vPersonnel = row.GetCell(71) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    bool vPictures = (bool)row.GetCell(72).BooleanCellValue; ;
                    string vSpeciesComments = row.GetCell(73) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vTagInjuryComments = row.GetCell(74) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vInjuryComments = row.GetCell(75) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vExamInjuryComments = row.GetCell(76) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vExamComments = row.GetCell(77) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vPicturesComments = row.GetCell(78) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vMeasurementsComments = row.GetCell(79) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vMissingPartsComments = row.GetCell(80) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vStomachContents = row.GetCell(81) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vOtherSamplesComments = row.GetCell(82) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vSamplesComments = row.GetCell(83) == null ? string.Empty : row.GetCell(16).StringCellValue; ;
                    string vGeneralComments = row.GetCell(84) == null ? string.Empty : row.GetCell(16).StringCellValue; ;

                    datas.Add(new NecropsyData
                    {
                        RowIndex = rowIndex,
                        NecropsyId = vNecropsyId,
                        CommonName = vCommonName,
                        SpeciesId = vSpeciesId,
                        NecropsyDate = vNecropsyDate,
                        Sex = vSex,
                        Location = vLocation,
                        GridCell = vGridCell,
                        DateReceived = vDateReceived,
                        DateKilled = vDateKilled,
                        AgeClass = vAgeClass,
                        AgeEstimated = vAgeEstimated,
                        Submitter = vSubmitter,
                        ContactInfo = vContactInfo,
                        RegionId = vRegionId,
                        MethodKilled = vMethodKilled,
                        Injuries = vInjuries,
                        TagComments = vTagComments,
                        TagReCheck = vTagReCheck,
                        BodyWt_unskinned = vBodyWt_unskinned,
                        NeckGirth_unsk = vTNeckGirth_unsk,
                        ChestGirth_unsk = vChestGirth_unsk,
                        Contour_Nose_Tail = vContour_Nose_Tail,
                        Tail_Length = vTail_Length,
                        BodyWt_skinned = vBodyWt_skinned,
                        PeltWt = vPeltWt,
                        NeckGirth_sk = vNeckGirth_sk,
                        ChestGirth_sk = vChestGirth_sk,
                        RumpFat = vRumpFat,
                        TotalRank_Ext = vTotalRank_Ext,
                        Tongue = vTongue,
                        HairCollected = vHairCollected,
                        SkullCollected = vSkullCollected,
                        HindLegMuscle_StableIsotopes = vHindLegMuscle_StableIsotopes,
                        HindLegMuscle_Contaminants = vHindLegMuscle_Contaminants,
                        Femur = vFemur,
                        Feces = vFeces,
                        Diaphragm = vDiaphragm,
                        Lung = vLung,
                        Liver_DNA = vLiver_DNA,
                        Liver_SIA = vLiver_SIA,
                        Liver_Contam = vLiver_Contam,
                        Spleen = vSpleen,
                        KidneyL = vKidneyL,
                        KidneyL_wt = vKidneyL_wt,
                        KidneyR = vKidneyR,
                        KidneyR_wt = vKidneyR_wt,
                        Blood_tabs = vBlood_tabs,
                        Blood_tubes = vBlood_tubes,
                        Stomach = vStomach,
                        StomachCont = vStomachCont,
                        Stomach_Full = vStomach_Full,
                        Stomach_Empty = vStomach_Empty,
                        StomachCont_wt = vStomachCont_wt,
                        StomachContentDesc = vStomachContentDesc,
                        IntestinalTract = vIntestinalTract,
                        UterineScars = vUterineScars,
                        Uterus = vUterus,
                        Ovaries = vOvaries,
                        LymphNodes = vLymphNodes,
                        Others = vOthers,
                        InternalRank = vInternalRank,
                        PeltColor = vPeltColor,
                        BackFat = vBackFat,
                        SternumFat = vSternumFat,
                        InguinalFat = vInguinalFat,
                        Incentive = vIncentive,
                        IncentiveAmt = vncentiveAmt,
                        Conflict = vConflict,
                        GroupSize = vGroupSize,
                        PackId = vPackId,
                        Xiphoid = vXiphoid,
                        Personnel = vPersonnel,
                        Pictures = vPictures,
                        SpeciesComments = vSpeciesComments,
                        TagInjuryComments = vTagInjuryComments,
                        InjuryComments = vInjuryComments,
                        ExamInjuryComments = vExamInjuryComments,
                        ExamComments = vExamComments,
                        PicturesComments = vPicturesComments,
                        MeasurementsComments = vMeasurementsComments,
                        MissingPartsComments = vMissingPartsComments,
                        StomachContents = vStomachContents,
                        OtherSamplesComments = vOtherSamplesComments,
                        SamplesComments = vSamplesComments,
                        GeneralComments = vGeneralComments,

                    });

                }
            }


            return datas;
        }

        private IWorkbook GetWorkbook(string fileName)
        {
            // get uploaded file and do some validation to ensure it is the right template
            var fileInfo = new FileInfo(fileName);
            switch (fileInfo.Extension)
            {
                case ".xls":
                    return WorkbookFactory.Create(fileName);
                case ".xlsx":
                    return WorkbookFactory.Create(fileName);
            }

            throw new ArgumentException("Specified file is not a valid Excel document.");

        }



    }
}
