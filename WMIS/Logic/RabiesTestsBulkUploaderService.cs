using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.IO;
using NPOI.SS.UserModel;

namespace Wmis.Logic
{

    public class RabiesTestsData
    {
        public int RowIndex { get; set; }
        public DateTime? DateTested { get; set; }
        public string DataStatus { get; set; }
        public string Year { get; set; }
        public string SubmittingAgency { get; set; }
        public string LaboratoryIDNo { get; set; }
        public string TestResult { get; set; }
        public string Community { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int RegionId { get; set; }
        public string GeographicRegion { get; set; }
        public string Species { get; set; }
        public string AnimalContact { get; set; }
        public string HumanContact { get; set; }
        public string Comments { get; set; }
    }


    public class RabiesTestsBulkUploaderService
    {
        // get data from the first WorkBook
        public IEnumerable<RabiesTestsData> GetData(string fileName, int firstDataRowIndex)
        {
            IWorkbook workbook = this.GetWorkbook(fileName);

            var datas = new List<RabiesTestsData>();
            var sheet = workbook.GetSheetAt(0);

            for (var rowIndex = firstDataRowIndex; rowIndex <= sheet.LastRowNum; rowIndex++)
            {
                var row = sheet.GetRow(rowIndex);
                if (row != null)
                {
                    DateTime? vDateTested = (DateTime?)row.GetCell(0).DateCellValue;
                    string vDataStatus = row.GetCell(1) == null ? string.Empty : row.GetCell(1).StringCellValue; ;
                    string vYear = row.GetCell(2) == null ? string.Empty : row.GetCell(2).StringCellValue; ;
                    string vSubmittingAgency = row.GetCell(3) == null ? string.Empty : row.GetCell(3).StringCellValue; 
                    string vLaboratoryIDNo = row.GetCell(4) == null ? string.Empty : row.GetCell(4).StringCellValue;
                    string vTestResult = row.GetCell(5) == null ? string.Empty : row.GetCell(5).StringCellValue;
                    string vCommunity = row.GetCell(6) == null ? string.Empty : row.GetCell(6).StringCellValue; 
                    float vLatitude = (float)row.GetCell(7).NumericCellValue; 
                    float vLongitude = (float)row.GetCell(8).NumericCellValue; 
                    int vRegionId = (int)row.GetCell(9).NumericCellValue; 
                    string vGeographicRegion = row.GetCell(10) == null ? string.Empty : row.GetCell(10).StringCellValue; 
                    string vSpecies = row.GetCell(11) == null ? string.Empty : row.GetCell(11).StringCellValue; 
                    string vAnimalContact = row.GetCell(12) == null ? string.Empty : row.GetCell(12).StringCellValue; 
                    string vHumanContact = row.GetCell(13) == null ? string.Empty : row.GetCell(13).StringCellValue; 
                    string vComments = row.GetCell(14) == null ? string.Empty : row.GetCell(14).StringCellValue; 

                    datas.Add(new RabiesTestsData
                    {
                        RowIndex = rowIndex,
                        DateTested = vDateTested,
                        DataStatus = vDataStatus,
                        Year = vYear,
                        SubmittingAgency = vSubmittingAgency,
                        LaboratoryIDNo = vLaboratoryIDNo,
                        TestResult = vTestResult,
                        Community = vCommunity,
                        Latitude = vLatitude,
                        Longitude = vLongitude,
                        RegionId = vRegionId,
                        GeographicRegion = vGeographicRegion,
                        Species = vSpecies,
                        AnimalContact = vAnimalContact,
                        HumanContact = vHumanContact,
                        Comments = vComments

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
