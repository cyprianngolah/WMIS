using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Wmis.Logic
{
    using System.IO;

    using NPOI.SS.UserModel;

    public class ReferenceRow
    {
        public int RowIndex { get; set; }

        public List<string> CellValues { get; set; }

        public ReferenceRow()
        {
            CellValues = new List<string>();
        }
    }

    public class ReferenceColumn
    {
        public int RowIndex { get; set; }

        public int ColumnIndex { get; set; }

        public string CellValue { get; set; }
    }

    public class ReferenceData
    {
        public int ColumnId { get; set; }

        public int RowIndex { get; set; }

        public string Value { get; set; }
    }
    public class ReferenceParserService
    {
        public IEnumerable<ReferenceRow> GetFirstRows(int rowCount, string fileName)
        {
            IWorkbook workbook = this.GetWorkbook(fileName);

            var referenceRows = new List<ReferenceRow>();
            var sheet = workbook.GetSheetAt(0);
            var maxColumnCount = this.GetMaxColumnWidthInASheet(sheet, rowCount);

            var numberOfRows = rowCount > sheet.LastRowNum - sheet.FirstRowNum ? sheet.LastRowNum - sheet.FirstRowNum : rowCount;
            for (var rowIndex = sheet.FirstRowNum + 1; rowIndex <= numberOfRows; rowIndex++)
            {
                var row = sheet.GetRow(rowIndex);
                if (row != null)
                {
                    var observationRow = new ReferenceRow
                    {
                        RowIndex = rowIndex,
                        CellValues = new List<string>(new String[maxColumnCount])
                    };
                    bool exitLoop = false;
                    for (var cellIndex = row.FirstCellNum; cellIndex < row.LastCellNum; cellIndex++)
                    {
                        var cell = row.GetCell(cellIndex);
                        // Family(index 5) and Name(index 6) are required fields 
                        if (cell == null)
                        {
                            observationRow.CellValues[cellIndex] = string.Empty;
                            continue;
                        }


                        switch (cell.CellType)
                        {
                            case CellType.String:
                                if ((cellIndex == 5 || cellIndex == 6) && string.IsNullOrEmpty(cell.StringCellValue)) exitLoop = true;
                                observationRow.CellValues[cellIndex] = cell.StringCellValue;
                                break;
                            case CellType.Numeric:
                                if (DateUtil.IsCellDateFormatted(cell))
                                {
                                    observationRow.CellValues[cellIndex] = cell.DateCellValue.ToString();
                                }
                                else
                                {
                                    observationRow.CellValues[cellIndex] = cell.NumericCellValue.ToString();
                                }
                                break;
                            default:
                                if (cellIndex == 5 || cellIndex == 6) exitLoop = true;
                                observationRow.CellValues[cellIndex] = string.Empty;
                                break;
                        }

                    }
                    if (!exitLoop) referenceRows.Add(observationRow);
                }
            }

            return referenceRows;
        }

        private IWorkbook GetWorkbook(string fileName)
        {

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

        private string GetFormulaEvaluatedValue(ICell cell)
        {
            switch (cell.CachedFormulaResultType)
            {
                case CellType.Numeric:
                    return cell.NumericCellValue.ToString();
                case CellType.String:
                    return cell.StringCellValue;
            }
            throw new ArgumentException("Cell formula does not evaluate to a known value.");
        }

        private int GetMaxColumnWidthInASheet(ISheet sheet, int? rowCount = int.MaxValue)
        {
            var maxColumnWidth = 0;

            var numberOfRows = rowCount > sheet.LastRowNum - sheet.FirstRowNum ? sheet.LastRowNum - sheet.FirstRowNum : rowCount;
            for (var rowIndex = sheet.FirstRowNum; rowIndex <= numberOfRows; rowIndex++)
            {
                var row = sheet.GetRow(rowIndex);
                if (row != null && row.LastCellNum > maxColumnWidth)
                {
                    maxColumnWidth = row.LastCellNum;
                }
            }

            return maxColumnWidth;
        }
    }
}