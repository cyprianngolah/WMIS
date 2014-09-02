namespace Wmis.Models
{
	using System;
	using System.Collections.Generic;
	using System.Data;
	using System.Data.SqlClient;
	using System.Linq;
	using Dapper;
	using Configuration;
	using Dto;
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
		/// The Taxonomy Update stored procedure
		/// </summary>
		private const string TAXONOMY_SAVE = "dbo.Taxonomy_Save";

		/// <summary>
		/// The Taxonomy Create stored procedure
		/// </summary>
		private const string BIODIVERSITY_CREATE = "dbo.BioDiversity_Create";

		/// <summary>
		/// The BioDiversity Get stored procedure
		/// </summary>
		private const string BIODIVERSITY_GET = "dbo.BioDiversity_Get";

		/// <summary>
		/// The BioDiversity Search stored procedure
		/// </summary>
		private const string BIODIVERSITY_SEARCH = "dbo.BioDiversity_Search";

		/// <summary>
		/// The BioDiversity Update
		/// </summary>
		private const string BIODIVERSITY_UPDATE = "dbo.BioDiversity_Update";

		/// <summary>
		/// The BioDiversity Get Decision stored procedure
		/// </summary>
		private const string BIODIVERSITY_DECISION_GET = "dbo.BioDiversity_Get_Decision";

		/// <summary>
		/// The BioDiversity Decision Update stored procedure
		/// </summary>
		private const string BIODIVERSITY_DECISION_UPDATE = "dbo.BioDiversity_Update_Decision";

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
		/// The Ecoregion Get stored procedure
		/// </summary>
		private const string ECOREGION_GET = "dbo.Ecoregion_Get";
        
		/// <summary>
		/// The Ecozone Get stored procedure
		/// </summary>
		private const string ECOZONE_GET = "dbo.Ecozone_Get";

		/// <summary>
		/// The Protected Area Get stored procedure
		/// </summary>
		private const string PROTECTEDAREA_GET = "dbo.ProtectedArea_Get";
        
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
		#region BioDiversity
		public Dto.PagedResultset<BioDiversity> BioDiversityGet(Dto.BioDiversitySearchRequest sr)
		{
			var results = new Dto.PagedResultset<BioDiversity>
			{
				DataRequest = sr,
				ResultCount = 1
			};

			results.Data.Add(new BioDiversity
			{
				Key = 1,
				Name = "Bison bison athabascae",
				CommonName = "Woods Bison",
				SubSpeciesName = "Bovinae",
				LastUpdated = DateTime.UtcNow.AddMinutes(-5012)
			});

			return results;
		}

		public BioDiversity BioDiversityGet(int bioDiversityKey)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_bioDiversityKey = bioDiversityKey
				};
				return c.Query<BioDiversity>(BIODIVERSITY_GET, param, commandType: CommandType.StoredProcedure).FirstOrDefault();
			}
		}

		public void BioDiversityCreate(string name)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_name = name
				};
				c.Execute(BIODIVERSITY_CREATE, param, commandType: CommandType.StoredProcedure);
			}
		}

		public void BioDiversityUpdate(Dto.BioDiversityUpdateRequest br)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					
				};
				c.Execute(BIODIVERSITY_UPDATE, param, commandType: CommandType.StoredProcedure);
			}
		}

		public BioDiversityDecision BioDiversityDecisionGet(int bioDiversityKey)
		{
			return new BioDiversityDecision();
		}

		public void BioDiversityDecisionUpdate(Dto.BioDiversityDecisionUpdateRequest ur)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					
				};
				c.Execute(BIODIVERSITY_DECISION_UPDATE, param, commandType: CommandType.StoredProcedure);
			}
		}
		#endregion

		#region Taxonomy
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

		public void TaxonomySave(Dto.TaxonomySaveRequest sr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_taxonomyId = sr.TaxonomyKey,
					p_taxonomyGroupId = sr.TaxonomyGroupKey,
					p_name = sr.Name
				};

				c.Execute(TAXONOMY_SAVE, param, commandType: CommandType.StoredProcedure);
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

		#region Ecoregion
		/// <summary>
		/// Gets a list of Ecoregions
		/// </summary>
		/// <param name="request">The information about the Ecoregion Request</param>
		/// <returns>A list of matching Ecoregions</returns>
		public PagedResultset<Ecoregion> EcoregionGet(EcoregionRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = request.StartRow,
					p_to = request.StartRow + request.RowCount - 1,
					p_sortBy = request.SortBy,
					p_sortDirection = request.SortDirection,
					p_keywords = request.Keywords,
				};

				var pagedResults = new PagedResultset<Ecoregion>
				{
					DataRequest = request,
					ResultCount = 0,
					Data = new List<Ecoregion>()
				};

				var results = c.Query<dynamic, Ecoregion, Ecoregion>(ECOREGION_GET,
					(d, t) =>
					{
						pagedResults.ResultCount = d.TotalRowCount;
						return t;
					}, param, commandType: CommandType.StoredProcedure, splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}
		#endregion

		#region Ecozone
		/// <summary>
		/// Gets a list of Ecozones
		/// </summary>
		/// <param name="request">The information about the Ecozone Request</param>
		/// <returns>A list of matching Ecozones</returns>
		public PagedResultset<Ecozone> EcozoneGet(EcozoneRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = request.StartRow,
					p_to = request.StartRow + request.RowCount - 1,
					p_sortBy = request.SortBy,
					p_sortDirection = request.SortDirection,
					p_keywords = request.Keywords,
				};

				var pagedResults = new PagedResultset<Ecozone>
				{
					DataRequest = request,
					ResultCount = 0,
					Data = new List<Ecozone>()
				};

				var results = c.Query<dynamic, Ecozone, Ecozone>(ECOZONE_GET,
					(d, t) =>
					{
						pagedResults.ResultCount = d.TotalRowCount;
						return t;
					}, param, commandType: CommandType.StoredProcedure, splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}
		#endregion
		
		#region ProtectedArea
		/// <summary>
		/// Gets a list of Protected Areas
		/// </summary>
		/// <param name="request">The information about the Protected Area Request</param>
		/// <returns>A list of matching Protected Areas</returns>
		public PagedResultset<ProtectedArea> ProtectedAreaGet(ProtectedAreaRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = request.StartRow,
					p_to = request.StartRow + request.RowCount - 1,
					p_sortBy = request.SortBy,
					p_sortDirection = request.SortDirection,
					p_keywords = request.Keywords,
				};

				var pagedResults = new PagedResultset<ProtectedArea>
				{
					DataRequest = request,
					ResultCount = 0,
					Data = new List<ProtectedArea>()
				};

				var results = c.Query<dynamic, ProtectedArea, ProtectedArea>(PROTECTEDAREA_GET,
					(d, t) =>
					{
						pagedResults.ResultCount = d.TotalRowCount;
						return t;
					}, param, commandType: CommandType.StoredProcedure, splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}
		#endregion
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