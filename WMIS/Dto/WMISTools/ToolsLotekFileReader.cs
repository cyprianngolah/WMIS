using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using CsvHelper;

namespace Wmis.Dto.WMISTools
{
    public class ToolsLotekFileReader
    {

        public ToolsLotekOutputFile ParseLotekFile(FileInfo file)
        {
            ToolsLotekOutputFile outFile = new ToolsLotekOutputFile();

            using (var fs = file.OpenRead())
            {
                using (var csv = new CsvReader(new StreamReader(fs)))
                {
                    var headers = new List<string>();

                    csv.Read();
                    if (csv.FieldHeaders.Length > 0)
                    {
                        headers = csv.FieldHeaders.Select(t => t.ToLower().Trim()).ToList();
                    }

                    while (csv.Read())
                    {
                        ToolsLotekOutputFileRow detail = null;
                        detail = ReadLotekFileRow(csv, headers);

                        if (detail != null && !outFile.Rows.Contains(detail) && (detail.Latitude != 0 && detail.Longitude != 0))
                            outFile.Rows.Add(detail);
                    }
                }
            }

            return outFile;
        }

        public IEnumerable<ToolsLotekData> GetLotekDataRows(ToolsLotekOutputFile parsedFile)
        {

            var dataRows = new List<ToolsLotekData>();
            foreach (var row in parsedFile.Rows.Where(r => r.Latitude.HasValue
                                                && r.Longitude.HasValue
                                                && r.TimestampGMT <= DateTime.Now
                                                && r.TimestampGMT > DateTime.MinValue))
            {
                var data = new ToolsLotekData
                {
                    DeviceId = row.DeviceId,
                    LocationDate = row.TimestampGMT,
                    Latitude = row.Latitude,
                    Longitude = row.Longitude,
                    LocationClass = "G"
                };

                dataRows.Add(data);

            }

            return dataRows;
        }


        private ToolsLotekOutputFileRow ReadLotekFileRow(CsvReader csv, List<string> headers)
        {
            var detail = new ToolsLotekOutputFileRow();

            if (headers.Contains("device id"))
                detail.DeviceId = csv.GetField<string>(headers.IndexOf("device id")).Trim();

            if (headers.Contains("date & time [gmt]"))
                detail.TimestampGMT = DateTime.FromOADate(csv.GetField<double>(headers.IndexOf("date & time [gmt]")));

            if (headers.Contains("latitude"))
                detail.Latitude = csv.GetField<double?>(headers.IndexOf("latitude"));

            if (headers.Contains("longitude"))
                detail.Longitude = csv.GetField<double?>(headers.IndexOf("longitude"));

            if (headers.Contains("altitude"))
                detail.Altitude = csv.GetField<double?>(headers.IndexOf("altitude"));

            if (headers.Contains("fix status"))
                detail.FixStatus = csv.GetField<string>(headers.IndexOf("fix status")).Trim();

            return detail;
        }

    }
}