namespace Wmis.ApiControllers
{
	using System.Collections.Generic;
	using System.Web.Http;

	[RoutePrefix("api/taxonomy")]
	public class TaxonomyApiController : BaseApiController
    {
		public TaxonomyApiController(Configuration.WebConfiguration configuration)
			: base(configuration)
		{
		}

		/// <summary>
		/// Gets the Kingdom Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching Kingdoms</returns>
		[HttpGet]
		[Route("kingdom/{key:int?}")]
		public IEnumerable<Models.Taxonomy> GetKingdom(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetPhylum(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetSubPhlym(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetClass(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetSubClass(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetOrder(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetSubOrder(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetInfraOrder(int? key = null)
		{
			return Repository.TaxonomyGet(key, 8);
		}

		/// <summary>
		/// Gets the SuperFamily Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching SuperFamilys</returns>
		[HttpGet]
		[Route("superfamily/{key:int?}")]
		public IEnumerable<Models.Taxonomy> GetSuperFamily(int? key = null)
		{
			return Repository.TaxonomyGet(key, 9);
		}

		/// <summary>
		/// Gets the Family Taxonomy
		/// </summary>
		/// <param name="key">Key to filter by</param>
		/// <returns>The list of matching Familys</returns>
		[HttpGet]
		[Route("family/{key:int?}")]
		public IEnumerable<Models.Taxonomy> GetFamily(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetSubFamily(int? key = null)
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
		public IEnumerable<Models.Taxonomy> GetGroups(int? key = null)
		{
			return Repository.TaxonomyGet(key, 12);
		}
    }
}
