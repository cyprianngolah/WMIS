namespace Wmis.Argos.Test
{
	using System.Linq;

	using Microsoft.VisualStudio.TestTools.UnitTesting;

	[TestClass]
	public class ArgosDataClientTests
	{
		[TestMethod]
		public void GetArgosDataForCollar()
		{
			// Arrange
			var ac = new ArgosDataClient("gunn", "northter");

			// Act
			var data = ac.RetrieveArgosDataForCollar("110918");

			// Assert
			Assert.IsTrue(data.Any());
		}
	}
}
