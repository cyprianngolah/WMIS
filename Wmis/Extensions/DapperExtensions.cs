namespace Wmis.Extensions
{
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Reflection;
    using Dapper;

    public static class DapperExtensions
    {
        /// <summary>
        /// Wrapper class for passing IEnumerable<int> into a IntTableRow value parameter
        /// </summary>
        public class IntTableRow
        {
            public int n { get; set; }
        }

        /// <summary>
        /// Helper method to simplify creation of table valued parameters.
        /// </summary>
        /// <typeparam name="T">The object type mirroring the table type.</typeparam>
        /// <param name="data">The data.</param>
        /// <param name="typeName">The table type name.</param>
        /// <returns>The parameter.</returns>
        public static SqlMapper.ICustomQueryParameter AsTableValuedParameter<T>(this IEnumerable<T> data, string typeName)
        {
            // It is important to call to list here to ensure any projections get 
            // evaluated before constructing the data table
            return data.ToList().ToDataTable().AsTableValuedParameter(typeName);
        }

        /// <summary>
        /// Converts the source enumerable into a DataTable via reflection.
        /// </summary>
        /// <typeparam name="T">Type of object in the source enumerable.</typeparam>
        /// <param name="source">The source enumerable.</param>
        /// <returns>The corresponding data table.</returns>
        private static DataTable ToDataTable<T>(this IList<T> source)
        {
            var table = new DataTable();

            // create table schema based on property type 
            var properties = source.GetType().GetGenericArguments()[0].GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.GetProperty).ToList();
            foreach (var property in properties)
            {
                table.Columns.Add(property.Name, property.PropertyType);
            }

            if (source.Any())
            {
                // create table data from T instances 
                var values = new object[properties.Count];

                foreach (var item in source)
                {
                    for (var i = 0; i < properties.Count; i++)
                    {
                        values[i] = properties[i].GetValue(item, null);
                    }

                    table.Rows.Add(values);
                }
            }

            return table;
        }
    }
}