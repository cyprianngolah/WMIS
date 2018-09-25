namespace Wmis.Dto
{
    public class ArgosPassUpdateRequest
    {
        public int ArgosPassId { get; set; }

        public int ArgosPassStatusId { get; set; }

        public string Comment { get; set; }

        public bool? IsLastValidLocation { get; set; }
    }
}