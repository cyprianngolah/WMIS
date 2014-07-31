namespace Wmis.Models
{
	using System.Collections.Generic;
	using System.Data;
	using System.Data.SqlClient;
	using Configuration;
	using Dapper;

	/// <summary>
	/// WMIS Repository for SQL
	/// </summary>
	public class WmisRepository
	{
		#region Fields
		/// <summary>
		/// The Taxonomy Get stored procedure
		/// </summary>
		private const string TAXONOMY_GET = "dbo.Taxonomy_Get";

		/// <summary>
		/// The Connection String to connect to the WMIS database for the current environment
		/// </summary>
		private readonly string _connectionString;
		#endregion

		#region Constructors
		/// <summary>
		/// Initializes a new instance of the <see cref="WmisRepository" /> class.
		/// </summary>
		/// <param name="configuration">Configuration information about the current environment</param>
		public WmisRepository(WebConfiguration configuration)
		{
			_connectionString = configuration.ConnectionStrings["WMIS"];
		}
		#endregion

		#region Methods
		/// <summary>
		/// Gets a list of Taxonomies
		/// </summary>
		/// <param name="taxonomyId">The id of the Taxonomy to retrieve, can be null</param>
		/// <param name="taxonomyGroupId">The group id for the Taxonomies to retrieve, can be null </param>
		/// <returns>A list of matching Taxonomies</returns>
		public IEnumerable<Taxonomy> TaxonomyGet(int? taxonomyId = null, int? taxonomyGroupId = null)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_taxonomyId = taxonomyId,
					p_taxonomyGroupId = taxonomyGroupId
				};
				return c.Query<Taxonomy>(TAXONOMY_GET, param, commandType: CommandType.StoredProcedure);
			}
		}
		#endregion

		#region Helpers
		/// <summary>
		/// Gets a new SQLConnection to the WMIS Database for the current environment
		/// </summary>
		private SqlConnection NewWmisConnection
		{
			get { return new SqlConnection(_connectionString); }
		}
		#endregion
	}
}