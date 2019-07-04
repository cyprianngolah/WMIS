using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Logic
{

    using System.IO;
    using NPOI.SS.UserModel;


    public class SpeciesData
    {

        public int RowIndex { get; set; }
        public string Group { get; set; }
        public string Kingdom { get; set; }
        public string Phylum { get; set; }
        public string Class { get; set; }
        public string Order { get; set; }
        public string Family { get; set; }
        public string Name { get; set; }
        public string CommonName { get; set; }
        public string ELCode { get; set; }
        public string RangeExtentScore { get; set; }
        public string RangeExtentDescription { get; set; }
        public string NumberOfOccurencesScore { get; set; }
        public string NumberOfOccurencesDescription { get; set; }
        public string StatusRankId { get; set; }
        public string StatusRankDescription { get; set; }
        public string SRank { get; set; }
        public string DecisionProcessDescription { get; set; }

    }


    public class BiodiversityBulkUploaderService
    {
        // get data from the first WorkBook
        public IEnumerable<SpeciesData> GetData(string fileName, int firstDataRowIndex)
        {
            IWorkbook workbook = this.GetWorkbook(fileName);

            var datas = new List<SpeciesData>();
            var sheet = workbook.GetSheetAt(0);

            for (var rowIndex = firstDataRowIndex; rowIndex <= sheet.LastRowNum; rowIndex++)
            {
                var row = sheet.GetRow(rowIndex);
                if (row != null)
                {

                    string vGroup = row.GetCell(0) == null ? string.Empty : row.GetCell(0).StringCellValue;
                    string vKingdom = row.GetCell(1) == null ? string.Empty : row.GetCell(1).StringCellValue; ;
                    string vPhyllum = row.GetCell(2) == null ? string.Empty : row.GetCell(2).StringCellValue; ;
                    string vClass = row.GetCell(3) == null ? string.Empty : row.GetCell(3).StringCellValue; ;
                    string vOrder = row.GetCell(4) == null ? string.Empty : row.GetCell(4).StringCellValue; ;
                    string vFamily = row.GetCell(5) == null ? string.Empty : row.GetCell(5).StringCellValue; ;
                    string vName = row.GetCell(6) == null ? string.Empty : row.GetCell(6).StringCellValue; ;
                    string vCommonName = row.GetCell(7) == null ? string.Empty : row.GetCell(7).StringCellValue; ;
                    string vELCode = row.GetCell(8) == null ? string.Empty : row.GetCell(8).StringCellValue; ;
                    string vRangeExtentScore = row.GetCell(9) == null ? string.Empty : row.GetCell(9).StringCellValue; ;
                    string vRangeExtentDescription = row.GetCell(10) == null ? string.Empty : row.GetCell(10).StringCellValue; ;
                    string vNumberOfOccurencesScore = row.GetCell(11) == null ? string.Empty : row.GetCell(11).StringCellValue; ;
                    string vNumberOfOccurencesDescription = row.GetCell(12) == null ? string.Empty : row.GetCell(12).StringCellValue; ;
                    string vStatusRankId = row.GetCell(13) == null ? string.Empty : row.GetCell(13).StringCellValue; ;
                    string vStatusRankDescription = row.GetCell(14) == null ? string.Empty : row.GetCell(14).StringCellValue; ;
                    string vSRank = row.GetCell(15) == null ? string.Empty : row.GetCell(15).StringCellValue; ;
                    string vDecisionProcessDescription = row.GetCell(16) == null ? string.Empty : row.GetCell(16).StringCellValue; ;

                    datas.Add(new SpeciesData
                    {
                        RowIndex = rowIndex,
                        Group = vGroup,
                        Kingdom = vKingdom,
                        Phylum = vPhyllum,
                        Class = vClass,
                        Order = vOrder,
                        Family = vFamily,
                        Name = vName,
                        CommonName = vCommonName,
                        ELCode = vELCode,
                        RangeExtentScore = vRangeExtentScore,
                        RangeExtentDescription = vRangeExtentDescription,
                        NumberOfOccurencesScore = vNumberOfOccurencesScore,
                        NumberOfOccurencesDescription = vNumberOfOccurencesDescription,
                        StatusRankId = vStatusRankId,
                        StatusRankDescription = vStatusRankDescription,
                        SRank = vSRank,
                        DecisionProcessDescription = vDecisionProcessDescription
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