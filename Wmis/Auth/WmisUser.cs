namespace Wmis.Auth
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Security.Claims;

	public class WmisClaimTypes
	{
		public static string UserKey
		{
			get
			{
				return "http://wmis/identity/claims/userkey";
			}
		}
	}

	public class WmisUser
	{
		#region Fields
		private readonly ClaimsIdentity _identity;
		#endregion

		public int? Key
		{
			get
			{
				var userKeyClaim = _identity.FindFirst(WmisClaimTypes.UserKey);
				return userKeyClaim == null ? null : (int?)Convert.ToInt32(userKeyClaim.Value);
			}
		}

		public string Name
		{
			get
			{
				var givenNameClaim = _identity.FindFirst(ClaimTypes.GivenName);
				return givenNameClaim == null ? null : givenNameClaim.Value;
			}
		}

		public string Username
		{
			get
			{
				var nameClaim = _identity.FindFirst(ClaimTypes.Name);
				return nameClaim == null ? null : nameClaim.Value;
			}
		}

		public string Email
		{
			get
			{
				var emailClaim = _identity.FindFirst(ClaimTypes.Email);
				return emailClaim == null ? null : emailClaim.Value;
			}
		}

		public IEnumerable<string> Roles
		{
			get
			{
				if (_identity == null) 
					return new List<string>();

				var claims = _identity.FindAll(ClaimTypes.Role) ?? new List<Claim>();
				return claims.Select(x => x.Value);
			}
		}

		public WmisUser(ClaimsIdentity identity)
		{
			_identity = identity;
		}
	}
}