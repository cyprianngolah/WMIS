namespace Wmis.ApiControllers
{
	using System.Collections.Generic;
    using System.Linq;
	using System.Net;
	using System.Net.Http;
	using System.Web.Http;
    using Configuration;
    using Dto;
    using Models;

    [RoutePrefix("api/taxonomy")]
	public class TaxonomyApiController : BaseApiController
    {
		public TaxonomyApiController(WebConfiguration configuration)
			: base(configuration)
		{
		}

		#region Taxonomy CRUD
		/// <summary>
		/// Gets all Taxonomies of the specified Taxonomy Group Id
		/// </summary>
		/// <param name="tr">The Taxonomy Request details to filter by</param>
		/// <returns>The list of matching Taxonomy objects</returns>
		[HttpGet]
		[Route]
		public PagedResultset<Taxonomy> GetTaxonomies([FromUri]Dto.TaxonomyRequest tr)
		{
			if (tr == null)
			{
				tr = new TaxonomyRequest();
			}

			return Repository.TaxonomyGet(tr);
		}

		[HttpPost]
		[Route]
		public void SaveTaxonomy([FromBody]Dto.TaxonomySaveRequest tr)
		{
			Repository.TaxonomySave(tr);

            if (tr.TaxonomyKey.HasValue)
            {
                Repository.TaxonomySynonymSaveMany(tr.TaxonomyKey.Value, tr.Synonyms.Where(i => !string.IsNullOrWhiteSpace(i)));
            }
		}
		#endregion

		#region Taxonomy Group CRUD
		/// <summary>
		/// Gets all Taxonomy Groups
		/// </summary>
		/// <param name="groupKey">The Taxonomy Group Id to filter by</param>
		/// <returns>The list of matching Taxonomy Group objects</returns>
		[HttpGet]
		[Route("taxonomygroup/{groupKey:int?}")]
		public IEnumerable<TaxonomyGroup> GetTaxonomyGroups(int? groupKey = null)
		{
			return Repository.TaxonomyGroupGet(groupKey);
		}
		#endregion

		#region Typed Taxonomy Gets
		/// <summary>
		/// Gets the Kingdom Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching Kingdoms</returns>
		[HttpGet]
		[Route("kingdom/{key:int?}")]
		public IEnumerable<Taxonomy> GetKingdom(int? key = null)
		{
			return Repository.TaxonomyGet(key, 1);
		}

		/// <summary>
		/// Gets the Phylum Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching Phylum</returns>
		[HttpGet]
		[Route("phylum/{key:int?}")]
		public IEnumerable<Taxonomy> GetPhylum(int? key = null)
		{
			return Repository.TaxonomyGet(key, 2);
		}

		/// <summary>
		/// Gets the SubPhylum Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching SubPhylum</returns>
		[HttpGet]
		[Route("subphylum/{key:int?}")]
		public IEnumerable<Taxonomy> GetSubPhlym(int? key = null)
		{
			return Repository.TaxonomyGet(key, 3);
		}

		/// <summary>
		/// Gets the Class Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching Class</returns>
		[HttpGet]
		[Route("class/{key:int?}")]
		public IEnumerable<Taxonomy> GetClass(int? key = null)
		{
			return Repository.TaxonomyGet(key, 4);
		}

		/// <summary>
		/// Gets the SubClass Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching SubClasses</returns>
		[HttpGet]
		[Route("subclass/{key:int?}")]
		public IEnumerable<Taxonomy> GetSubClass(int? key = null)
		{
			return Repository.TaxonomyGet(key, 5);
		}

		/// <summary>
		/// Gets the Order Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching Orders</returns>
		[HttpGet]
		[Route("order/{key:int?}")]
		public IEnumerable<Taxonomy> GetOrder(int? key = null)
		{
			return Repository.TaxonomyGet(key, 6);
		}

		/// <summary>
		/// Gets the SubOrders Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching SubOrders</returns>
		[HttpGet]
		[Route("suborder/{key:int?}")]
		public IEnumerable<Taxonomy> GetSubOrder(int? key = null)
		{
			return Repository.TaxonomyGet(key, 7);
		}

		/// <summary>
		/// Gets the InfraOrder Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching InfraOrders</returns>
		[HttpGet]
		[Route("infraorder/{key:int?}")]
		public IEnumerable<Taxonomy> GetInfraOrder(int? key = null)
		{
			return Repository.TaxonomyGet(key, 8);
		}

		/// <summary>
		/// Gets the SuperFamily Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching SuperFamily objects</returns>
		[HttpGet]
		[Route("superfamily/{key:int?}")]
		public IEnumerable<Taxonomy> GetSuperFamily(int? key = null)
		{
			return Repository.TaxonomyGet(key, 9);
		}

		/// <summary>
		/// Gets the Family Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching Family objects</returns>
		[HttpGet]
		[Route("family/{key:int?}")]
		public IEnumerable<Taxonomy> GetFamily(int? key = null)
		{
			return Repository.TaxonomyGet(key, 10);
		}
		
		/// <summary>
		/// Gets the SubFamily Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching SubFamily</returns>
		[HttpGet]
		[Route("subfamily/{key:int?}")]
		public IEnumerable<Taxonomy> GetSubFamily(int? key = null)
		{
			return Repository.TaxonomyGet(key, 11);
		}

		/// <summary>
		/// Gets the Groups Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching Groups</returns>
		[HttpGet]
		[Route("group/{key:int?}")]
		public IEnumerable<Taxonomy> GetGroups(int? key = null)
		{
			return Repository.TaxonomyGet(key, 12);
		}
		#endregion

		#region Synonym Various
		/// <summary>
        /// Gets the TaxonomySynonyms for the given Taxonomy's
        /// </summary>
        /// <param name="taxonomyIds">Taxonomy's to filter by</param>
        /// <returns>The list of matching TaxonomySynonyms</returns>
        [HttpPost]
        [Route("synonym")]
        public IEnumerable<TaxonomySynonymRequest> GetSynonyms(IEnumerable<int> taxonomyIds)
        {
            return taxonomyIds
                .Select(taxonomyId => new TaxonomySynonymRequest
                    {
                        TaxonomyId = taxonomyId,
                        Synonyms = Repository.TaxonomySynonymGet(taxonomyId).Select(i => i.Name),
                    })
                .ToList();
        }

        /// <summary>
        /// Saves the TaxonomySynonyms
        /// </summary>
        /// <param name="tsr">Taxonomy Synonym Request to save</param>
        [HttpPost]
        [Route("synonym/savemany")]
        public void SaveSynonyms([FromBody]Dto.TaxonomySynonymRequest tsr)
        {
            Repository.TaxonomySynonymSaveMany(tsr.TaxonomyId, tsr.Synonyms.Where(i => !string.IsNullOrWhiteSpace(i)));
		}
		#endregion
	}
}