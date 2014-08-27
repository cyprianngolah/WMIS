namespace Wmis.Models
{
	using System.Collections.Generic;
	using System.Data;
	using System.Data.SqlClient;
    using System.Linq;
    using Configuration;
	using Dapper;
    using Extensions;

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
        /// The Taxonomy Synonym Get stored procedure
        /// </summary>
        private const string TAXONOMYSYNONYM_GET = "dbo.TaxonomySynonym_Get";

        /// <summary>
        /// The Taxonomy Synonym Get stored procedure
        /// </summary>
        private const string TAXONOMYSYNONYM_SAVEMANY = "dbo.TaxonomySynonym_SaveMany";

		/// <summary>
		/// The Taxonomy Groups Get stored procedure
		/// </summary>
		private const string TAXONOMYGROUP_GET = "dbo.TaxonomyGroups_Get";
        
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
				return c.Query<dynamic, Taxonomy, TaxonomyGroup, Taxonomy>(TAXONOMY_GET,
					(d, t, tg) =>
					{
						t.TaxonomyGroup = tg;
						return t;
					}, param, commandType: CommandType.StoredProcedure, splitOn: "Key");
			}
		}

		/// <summary>
		/// Gets a list of Taxonomies
		/// </summary>
		/// <param name="tr">The information about the Taxonomy Request</param>
		/// <returns>A list of matching Taxonomies</returns>
		public Dto.PagedResultset<Taxonomy> TaxonomyGet(Dto.TaxonomyRequest tr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = tr.StartRow,
					p_to = tr.StartRow + tr.RowCount - 1,
					p_sortBy = tr.SortBy,
					p_sortDirection = tr.SortDirection,
					p_keywords = tr.Keywords,
					p_taxonomyId = tr.TaxonomyKey,
					p_taxonomyGroupId = tr.TaxonomyGroupKey
				};

				var pagedResults = new Dto.PagedResultset<Taxonomy>
				{
					DataRequest = tr,
					ResultCount = 0,
					Data = new List<Taxonomy>()
				};

				var results = c.Query<dynamic, Taxonomy, TaxonomyGroup, Taxonomy>(TAXONOMY_GET,
					(d, t, tg) =>
					{
						pagedResults.ResultCount = d.TotalRowCount;
						t.TaxonomyGroup = tg;
						return t;
					}, param, commandType: CommandType.StoredProcedure, splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}

		/// <summary>
		/// Gets a list of Taxonomy Groups
		/// </summary>
		/// <param name="taxonomyGroupKey"></param>
		/// <returns>A list of matching Taxonomy Groups</returns>
		public IEnumerable<TaxonomyGroup> TaxonomyGroupGet(int? taxonomyGroupKey = null)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_taxonomyGroupId = taxonomyGroupKey
				};

				return c.Query<TaxonomyGroup>(TAXONOMYGROUP_GET, param, commandType: CommandType.StoredProcedure);
			}
		}

        /// <summary>
        /// Gets a list of Taxonomy Synonyms
        /// </summary>
        /// <param name="taxonomyId">The id of the Taxonomy to retrieve synonyms for, can be null</param>
        /// <returns>A list of matching Taxonomies</returns>
        public IEnumerable<TaxonomySynonym> TaxonomySynonymGet(int taxonomyId)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_taxonomyId = taxonomyId
                };
                return c.Query<TaxonomySynonym>(TAXONOMYSYNONYM_GET, param, commandType: CommandType.StoredProcedure);
            }
        }

	    /// <summary>
	    /// Gets a list of Taxonomy Synonyms
	    /// </summary>
	    /// <param name="taxonomyId">The id of the Taxonomy to save synonyms for</param>
	    /// <param name="synonyms">The complete list of synonyms for the specified Taxonomy</param>
	    public void TaxonomySynonymSaveMany(int taxonomyId, IEnumerable<string> synonyms)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_taxonomyId = taxonomyId,
                    p_taxonomySynonyms = synonyms.Select(i => new { Name = i }).AsTableValuedParameter("dbo.TaxonomySynonymType")
                };
                c.Execute(TAXONOMYSYNONYM_SAVEMANY, param, commandType: CommandType.StoredProcedure);
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