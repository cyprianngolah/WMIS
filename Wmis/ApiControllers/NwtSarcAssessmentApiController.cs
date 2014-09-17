namespace Wmis.ApiControllers
{
	using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

	/// <summary>
	/// The NWT SARC Assessment API Controller
	/// </summary>
	[RoutePrefix("api/nwtsarcassessment")]
	public class NwtSarcAssessmentApiController : BaseApiController
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="NwtSarcAssessmentApiController"/> class
		/// </summary>
		/// <param name="config">The config</param>
        public NwtSarcAssessmentApiController(WebConfiguration config) 
			: base(config)
		{
		}

		/// <summary>
        /// Gets all NWT SARC Assessments
		/// </summary>
        /// <param name="request">The NWT SARC Assessment Request details to filter by</param>
        /// <returns>The list of matching NWT SARC Assessment objects</returns>
		[HttpGet]
		[Route]
		public PagedResultset<NwtSarcAssessment> GetNwtSarcAssessments([FromUri]NwtSarcAssessmentRequest request)
		{
			return Repository.NwtSarcAssessmentGet(request ?? new NwtSarcAssessmentRequest());
		}

		/// <summary>
        /// Create or update an NWT SARC Assessment
		/// </summary>
        /// <param name="request">The NWT SARC Assessment details</param>
		[HttpPost]
		[Route]
        public void SaveNwtSarcAssessment([FromBody]NwtSarcAssessmentSaveRequest request)
		{
			Repository.NwtSarcAssessmentSave(request);
		}
    }
}
