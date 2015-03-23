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
			var ac = new ArgosDataClient();

			// Act
			var data = ac.RetrieveArgosDataForCollar("110918", "gunn", "northter");

			// Assert
			Assert.IsTrue(data.Any());
		}

	    [TestMethod]
	    public void GetArgosDataForProgram()
        {
            // Arrange
            var ac = new ArgosDataClient();

            // Act
            var data = ac.RetrieveArgosDataForProgram("606", "gunn", "northter");

            // Assert
            Assert.IsTrue(data.Any()); 
	    }
	}
}
