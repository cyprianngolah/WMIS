namespace Wmis.Dto
{
    public class ProjectCollaboratorsUpdateRequest
    {
        public int ProjectId { get; set; }

        public int[] CollaboratorIds { get; set; }
    }
}