namespace Wmis.Dto
{
	public class FileCreateRequest
	{
		public string ParentTableName { get; set; }
		
        public int ParentTableKey { get; set; }

		public string Name { get; set; }

		public string Path { get; set; }
	}
}