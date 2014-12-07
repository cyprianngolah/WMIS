namespace Wmis.Logic
{
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;

	using NPOI.HSSF.UserModel;
	using NPOI.SS.Formula.Functions;
	using NPOI.SS.UserModel;
	using NPOI.XSSF.UserModel;

	using Wmis.Configuration;

	public class ObservationRow
	{
		public int RowIndex { get; set; }

		public List<string> CellValues { get; set; }

		public ObservationRow()
		{
			CellValues = new List<string>();
		}
	}

	public class ObservationParserService
	{
		private readonly WebConfiguration _configuration;

		public ObservationParserService(WebConfiguration config)
		{
			_configuration = config;
		}

		public IEnumerable<ObservationRow> GetFirstRows(int rowCount, string fileName)
		{
			IWorkbook workbook = this.GetWorkbook(fileName);

			var observationRows = new List<ObservationRow>();
			var sheet = workbook.GetSheetAt(0);
			var maxColumnCount = this.GetMaxColumnWidthInASheet(sheet, rowCount);

			var numberOfRows = rowCount > sheet.LastRowNum - sheet.FirstRowNum ? sheet.LastRowNum - sheet.FirstRowNum : rowCount;
			for (var rowIndex = sheet.FirstRowNum; rowIndex <= numberOfRows; rowIndex++)
			{
				var row = sheet.GetRow(rowIndex);
				if (row != null)
				{
					var observationRow = new ObservationRow
						                     {
							                     RowIndex = rowIndex,
												 CellValues = new List<string>(new String[maxColumnCount])
						                     };
					
					for (var cellIndex = row.FirstCellNum; cellIndex < row.LastCellNum; cellIndex ++)
					{
						var cell = row.GetCell(cellIndex);
						observationRow.CellValues[cellIndex] = cell.StringCellValue;
					}
					observationRows.Add(observationRow);
				}
			}

			return observationRows;
		}

		private IWorkbook GetWorkbook(string fileName)
		{
			using (var fs = new FileStream(fileName, FileMode.Open, FileAccess.Read))
			{
				var fileInfo = new FileInfo(fileName);
				if (fileInfo.Extension == ".xls")
				{
					return new HSSFWorkbook(fs);
				}
				if (fileInfo.Extension == ".xlsx")
				{
					return new XSSFWorkbook(fs);
				}

				throw new ArgumentException("Specified file is not a valid Excel document.");
			}
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