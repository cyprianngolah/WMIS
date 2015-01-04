namespace Wmis.Logic
{
	using System;
	using System.Collections.Generic;
	using System.IO;

	using NPOI.HSSF.UserModel;
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

	public class ObservationColumn
	{
		public int RowIndex { get; set; }

		public int ColumnIndex { get; set; }

		public string CellValue { get; set; }
	}

	public class ObservationData
	{
		public int ColumnMappingId { get; set; }

		public int RowIndex { get; set; }

		public string Value { get; set; }
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
						if (cell == null)
						{
							observationRow.CellValues[cellIndex] = string.Empty;
							continue;
						}

						
						switch (cell.CellType)
						{
							case CellType.String:
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
								observationRow.CellValues[cellIndex] = string.Empty;
								break;
						}
					}

					//observationRow.CellValues[cellIndex] = cell.StringCellValue;
					observationRows.Add(observationRow);
				}
			}

			return observationRows;
		}

		public IEnumerable<ObservationColumn> GetColumns(string fileName, int headerRowIndex)
		{
			IWorkbook workbook = this.GetWorkbook(fileName);

			var observationColumns = new List<ObservationColumn>();
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
						observationColumns.Add(new ObservationColumn { RowIndex = row.RowNum, ColumnIndex = cellIndex, CellValue = cell.StringCellValue });
					}
				}
			}

			return observationColumns;
		}

		public IEnumerable<ObservationData> GetData(string fileName, int firstDataRowIndex, IEnumerable<Models.MappedSurveyTemplateColumn> mappings)
		{
			IWorkbook workbook = this.GetWorkbook(fileName);

			var datas = new List<ObservationData>();
			var sheet = workbook.GetSheetAt(0);

			for (var rowIndex = firstDataRowIndex; rowIndex <= sheet.LastRowNum; rowIndex++)
			{
				var row = sheet.GetRow(rowIndex);
				if (row != null)
				{
					foreach (var m in mappings)
					{
						if (!m.Key.HasValue || !m.ColumnIndex.HasValue || m.ColumnIndex.Value >= row.LastCellNum) 
							continue;

						string value;
						var cell = row.GetCell(m.ColumnIndex.Value);
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
								default:
									value = string.Empty;
									break;
							}
						}

						datas.Add(new ObservationData { RowIndex = rowIndex, ColumnMappingId = m.Key.Value, Value = value });
					}
				}
			}
			return datas;
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