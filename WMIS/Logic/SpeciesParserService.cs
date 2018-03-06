namespace Wmis.Logic
{
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;

	using NPOI.HSSF.UserModel;
	using NPOI.SS.UserModel;
	using NPOI.XSSF.UserModel;

	using Wmis.Configuration;

	public class SpecieRow
	{
		public int RowIndex { get; set; }

		public List<string> CellValues { get; set; }

        public SpecieRow()
		{
			CellValues = new List<string>();
		}
	}

    public class SpecieColumn
	{
		public int RowIndex { get; set; }

		public int ColumnIndex { get; set; }

		public string CellValue { get; set; }
	}

    public class SpecieData
	{
		public int ColumnId { get; set; }

		public int RowIndex { get; set; }

		public string Value { get; set; }
	}

	public class SpeciesParserService
	{
        //private readonly WebConfiguration _configuration;

        public SpeciesParserService()
		{
	
		}

        public IEnumerable<SpecieRow> GetFirstRows(int rowCount, string fileName)
		{
			IWorkbook workbook = this.GetWorkbook(fileName);

			var speciesRows = new List<SpecieRow>();
			var sheet = workbook.GetSheetAt(0);
			var maxColumnCount = this.GetMaxColumnWidthInASheet(sheet, rowCount);

			var numberOfRows = rowCount > sheet.LastRowNum - sheet.FirstRowNum ? sheet.LastRowNum - sheet.FirstRowNum : rowCount;
			for (var rowIndex = sheet.FirstRowNum + 1; rowIndex <= numberOfRows; rowIndex++)
			{
				var row = sheet.GetRow(rowIndex);
				if (row != null)
				{
					var observationRow = new SpecieRow
						                     {
							                     RowIndex = rowIndex,
												 CellValues = new List<string>(new String[maxColumnCount])
						                     };
				    bool exitLoop = false;
				    for (var cellIndex = row.FirstCellNum; cellIndex < row.LastCellNum; cellIndex ++)
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
				    if (!exitLoop) speciesRows.Add(observationRow);
				}
			}

            return speciesRows;
		}

		public IEnumerable<SpecieColumn> GetColumns(string fileName, int headerRowIndex)
		{
			IWorkbook workbook = this.GetWorkbook(fileName);

            var observationColumns = new List<SpecieColumn>();
			var sheet = workbook.GetSheetAt(0);

			var row = sheet.GetRow(headerRowIndex);
			if (row != null)
			{
				for (var cellIndex = row.FirstCellNum; cellIndex < row.LastCellNum; cellIndex++)
				{
					var cell = row.GetCell(cellIndex);
					if (cell == null)
						continue;

					if (cell.CellType == CellType.String)
					{
                        observationColumns.Add(new SpecieColumn { RowIndex = row.RowNum, ColumnIndex = cellIndex, CellValue = cell.StringCellValue });
					}
				}
			}

			return observationColumns;
		}

        public IEnumerable<SpecieData> GetData(string fileName, int firstDataRowIndex)
		{
			IWorkbook workbook = this.GetWorkbook(fileName);

            var datas = new List<SpecieData>();
			var sheet = workbook.GetSheetAt(0);

		    var columns = this.GetColumns(fileName, 0);

			for (var rowIndex = firstDataRowIndex; rowIndex <= sheet.LastRowNum; rowIndex++)
			{
				var row = sheet.GetRow(rowIndex);
				if (row != null)
				{
                    for (var columnIndex = 0; columnIndex <= columns.Count(); columnIndex++)
					{

						string value;
                        var cell = row.GetCell(columnIndex);
						if (cell == null)
						{
							value = string.Empty;
						}
						else
						{
							switch (cell.CellType)
							{
								case CellType.String:
									value = cell.StringCellValue;
									break;
								case CellType.Numeric:
									value = DateUtil.IsCellDateFormatted(cell) ? cell.DateCellValue.ToString() : cell.NumericCellValue.ToString();
									break;
								case CellType.Formula:
							        value = this.GetFormulaEvaluatedValue(cell);
							        break;
                                default:
									value = string.Empty;
									break;
							}
						}

                        datas.Add(new SpecieData { RowIndex = rowIndex, ColumnId = columnIndex, Value = value });
					}
				}
			}
			return datas;
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