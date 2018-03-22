using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wmis.Argos
{
    using System.IO;

    using CsvHelper;

    using Wmis.Argos.Entities;

    public class LotekFileReader
    {
        private DirectoryInfo _directory;

        public LotekFileReader(string folderPath)
        {
            _directory = new DirectoryInfo(folderPath);

            ValidatePath();
        }
        private bool ValidatePath()
        {
            if (!_directory.Exists)
                throw new Exception("The directory '" + _directory.FullName + "' doesn't exist");

            try
            {
                var file = _directory.GetFiles().FirstOrDefault();

                if (file != null)
                {
                    using (var fs = file.OpenRead())
                    {
                        fs.ReadByte();
                    }
                }

                return true;
            }
            catch (Exception e)
            {
                throw new Exception("Unable to read files from the directory.", e);
            }
        }

        public IEnumerable<LotekOutputFile> ReadFiles()
        {
            var files = new List<LotekOutputFile>();

            var csvFiles = _directory.GetFiles("*.csv");

            foreach (var csv in csvFiles)
            {
                var outFile = ParseFile(csv);

                files.Add(outFile);
            }

            return files;
        }

        private LotekOutputFile ParseFile(FileInfo file)
        {
            LotekOutputFile outFile = new LotekOutputFile();

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
                        LotekOutputFileRow detail = null;
                        detail = ReadLotekFileRow(csv, headers);
                     
                        if (detail != null && !outFile.Rows.Contains(detail) && string.IsNullOrEmpty(detail.Error))
                            outFile.Rows.Add(detail);
                    }
                }
            }

            return outFile;
        }
        private static LotekOutputFileRow ReadLotekFileRow(CsvReader csv, List<string> headers)
        {
            var detail = new LotekOutputFileRow();

            if (headers.Contains("device id"))
                detail.DeviceId = csv.GetField<string>(headers.IndexOf("device id"));

            if (headers.Contains("date & time [gmt]"))
                detail.TimestampGMT = DateTime.FromOADate(csv.GetField<double>(headers.IndexOf("date & time [gmt]")));

            if (headers.Contains("latitude"))
                detail.Latitude = csv.GetField<double?>(headers.IndexOf("latitude"));

            if (headers.Contains("longitude"))
                detail.Longitude = csv.GetField<double?>(headers.IndexOf("longitude"));

            if (headers.Contains("altitude"))
                detail.Altitude = csv.GetField<double?>(headers.IndexOf("altitude"));

            if (headers.Contains("fix status"))
                detail.FixStatus = csv.GetField<string>(headers.IndexOf("fix status"));

            if (headers.Contains("error"))
                detail.Error = csv.GetField<string>(headers.IndexOf("error"));

            return detail;
        }
    }
}
