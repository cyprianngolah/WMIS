namespace Wmis.Dto
{
    public class CollaboratorCreateRequest
	{
        public int ProjectId { get; set; }

        public string Name { get; set; }

        public string Organization { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }
	}
}